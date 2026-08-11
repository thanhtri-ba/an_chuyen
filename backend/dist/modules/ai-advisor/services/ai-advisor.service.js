"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAdvisorResponseSchema = exports.travelAdvisorOutputSchema = void 0;
exports.askTravelAdvisor = askTravelAdvisor;
const request_context_1 = require("@mastra/core/request-context");
const travel_advisor_agent_1 = require("../agents/travel-advisor.agent");
const zod_1 = require("zod");
const prisma_1 = require("../../../core/prisma");
const logger_1 = require("../../../core/logger");
const crypto_1 = require("crypto");
exports.travelAdvisorOutputSchema = zod_1.z.object({
    message: zod_1.z.string().describe('Câu trả lời phản hồi thân thiện bằng tiếng Việt.'),
    intent: zod_1.z.string().describe('Ý định của người dùng (ví dụ: chào hỏi, tìm chuyến xe, hỏi chính sách, hỏi lịch sử đặt vé, câu hỏi ngoài luồng...)'),
    missingFields: zod_1.z.array(zod_1.z.string()).describe('Danh sách thông tin còn thiếu (ví dụ: departureCity, arrivalCity, departureDate)'),
    recommendations: zod_1.z.array(zod_1.z.object({
        tripScheduleId: zod_1.z.string().describe('ID lịch trình chuyến xe.'),
        departureTime: zod_1.z.string().describe('Thời gian khởi hành.'),
        arrivalTime: zod_1.z.string().describe('Thời gian đến dự kiến.'),
        busAgentName: zod_1.z.string().describe('Tên nhà xe.'),
        price: zod_1.z.number().describe('Giá vé.'),
        availableSeats: zod_1.z.number().describe('Số ghế còn trống.'),
        score: zod_1.z.number().describe('Điểm số đề xuất (0-100).'),
        reasons: zod_1.z.array(zod_1.z.string()).describe('Các lý do đề xuất (ví dụ: Giờ đi đẹp, Giá rẻ, Tránh kẹt xe...).'),
    })).describe('Danh sách các chuyến xe được đề xuất, tối đa 3 chuyến.'),
    warnings: zod_1.z.array(zod_1.z.string()).describe('Cảnh báo liên quan (ví dụ: Thời điểm đi dễ kẹt xe...).'),
    requiresConfirmation: zod_1.z.boolean().describe('Luôn bằng true nếu cuộc hội thoại hướng tới bước đặt vé.'),
});
exports.aiAdvisorResponseSchema = exports.travelAdvisorOutputSchema.extend({
    reply: zod_1.z.string(),
    conversationId: zod_1.z.string().nullable(),
    messageId: zod_1.z.string().nullable(),
    feedbackEnabled: zod_1.z.boolean(),
    fallback: zod_1.z.boolean(),
});
async function askTravelAdvisor(input) {
    const timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10);
    const traceId = input.traceId || (0, crypto_1.randomUUID)();
    const requestContext = new request_context_1.RequestContext();
    requestContext.set('userId', input.userId);
    requestContext.set('traceId', traceId);
    let conversationId = null;
    let assistantMessageId = null;
    let dbSavingFailed = false;
    // Step 1: Initialize conversation and save user message inside try-catch to keep it secondary
    try {
        if (input.conversationId) {
            conversationId = input.conversationId;
        }
        else {
            const conv = await prisma_1.prisma.aiConversation.create({
                data: { userId: input.userId },
            });
            conversationId = conv.id;
        }
        await prisma_1.prisma.aiMessage.create({
            data: {
                conversationId: conversationId,
                role: 'USER',
                content: input.message,
                traceId,
            },
        });
        requestContext.set('conversationId', conversationId);
    }
    catch (dbError) {
        logger_1.logger.error(`[AI-Advisor] [${traceId}] Database user message logging failed: ${dbError.message}`);
        dbSavingFailed = true;
    }
    // Step 2: Query AI model with timeout
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), timeoutMs));
    const agentPromise = (async () => {
        const result = await travel_advisor_agent_1.travelAdvisorAgent.generate([
            {
                role: 'user',
                content: input.message,
            },
        ], {
            requestContext,
            structuredOutput: {
                schema: exports.travelAdvisorOutputSchema,
            },
        });
        if (result.object) {
            return result.object;
        }
        throw new Error('AI response did not match structured schema');
    })();
    let agentOutput;
    let isFallback = false;
    try {
        agentOutput = await Promise.race([agentPromise, timeoutPromise]);
    }
    catch (error) {
        logger_1.logger.error(`[AI-Advisor] [${traceId}] AI generation error: ${error.message}`);
        isFallback = true;
        agentOutput = {
            message: 'Xin lỗi bạn, trợ lý AI của An Chuyến hiện đang bận hoặc gặp sự cố kết nối. Bạn có thể liên hệ hotline 1900 6789 hoặc thử lại sau ít phút nhé!',
            intent: 'fallback_error',
            missingFields: [],
            recommendations: [],
            warnings: ['Hệ thống AI gặp sự cố kết nối.'],
            requiresConfirmation: false,
        };
    }
    // Step 3: Log assistant response to database
    if (conversationId && !dbSavingFailed && !isFallback) {
        try {
            const savedMsg = await prisma_1.prisma.aiMessage.create({
                data: {
                    conversationId: conversationId,
                    role: 'ASSISTANT',
                    content: agentOutput.message,
                    traceId,
                },
            });
            assistantMessageId = savedMsg.id;
        }
        catch (dbError) {
            logger_1.logger.error(`[AI-Advisor] [${traceId}] Database assistant message logging failed: ${dbError.message}`);
            dbSavingFailed = true;
        }
    }
    // Step 4: Construct dynamic response aligning with schema specifications
    return {
        ...agentOutput,
        reply: agentOutput.message,
        conversationId: dbSavingFailed ? null : conversationId,
        messageId: dbSavingFailed || isFallback ? null : assistantMessageId,
        feedbackEnabled: !dbSavingFailed && !isFallback,
        fallback: isFallback,
    };
}
