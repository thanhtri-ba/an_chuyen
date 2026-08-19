"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoliciesTool = void 0;
const tool_wrapper_1 = require("../utils/tool-wrapper");
const tools_1 = require("@mastra/core/tools");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const baseExecute = async ({ busAgentName }) => {
    const policies = await prisma.cancellationPolicy.findMany({
        where: busAgentName ? {
            busAgent: {
                name: {
                    contains: busAgentName,
                    mode: 'insensitive',
                },
            },
        } : undefined,
        select: {
            hoursBefore: true,
            refundPct: true,
            busAgent: {
                select: {
                    name: true,
                },
            },
        },
        take: 10,
    });
    return {
        policies: policies.map((p) => ({
            busAgentName: p.busAgent.name,
            hoursBefore: p.hoursBefore,
            refundPercentage: p.refundPct,
        })),
    };
};
exports.getPoliciesTool = (0, tools_1.createTool)({
    id: 'get-policies',
    description: 'Tra cứu chính sách hủy vé, hoàn tiền của các nhà xe khách trên hệ thống.',
    inputSchema: zod_1.z.object({
        busAgentName: zod_1.z.string().optional().describe('Tên nhà xe cụ thể cần tra cứu chính sách (ví dụ: Phương Trang, Thành Bưởi)'),
    }),
    outputSchema: zod_1.z.object({
        policies: zod_1.z.array(zod_1.z.object({
            busAgentName: zod_1.z.string(),
            hoursBefore: zod_1.z.number(),
            refundPercentage: zod_1.z.number(),
        })),
    }),
    execute: (0, tool_wrapper_1.wrapToolExecute)(baseExecute, {
        toolName: 'get-policies',
        allowedInputKeys: ['busAgentName'],
        summarizeOutput: (output) => ({ count: output?.policies?.length || 0 }),
    }),
});
