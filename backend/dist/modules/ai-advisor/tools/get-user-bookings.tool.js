"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBookingsTool = void 0;
const tool_wrapper_1 = require("../utils/tool-wrapper");
const tools_1 = require("@mastra/core/tools");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const baseExecute = async (input, context) => {
    const requestContext = context?.requestContext;
    const userId = requestContext?.get('userId');
    if (!userId) {
        throw new Error('User is not authenticated');
    }
    const bookings = await prisma.booking.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            status: true,
            totalAmount: true,
            createdAt: true,
            tripSchedule: {
                select: {
                    departureTime: true,
                    trip: {
                        select: {
                            route: {
                                select: {
                                    departureCity: { select: { name: true } },
                                    arrivalCity: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
    });
    return {
        bookings: bookings.map((b) => ({
            bookingId: b.id,
            status: b.status,
            totalAmount: b.totalAmount,
            route: `${b.tripSchedule.trip.route.departureCity.name} -> ${b.tripSchedule.trip.route.arrivalCity.name}`,
            departureTime: b.tripSchedule.departureTime.toISOString(),
            createdAt: b.createdAt.toISOString(),
        })),
    };
};
exports.getUserBookingsTool = (0, tools_1.createTool)({
    id: 'get-user-bookings',
    description: 'Lấy lịch sử đặt vé gần đây của người dùng hiện tại đang đăng nhập.',
    inputSchema: zod_1.z.object({}),
    outputSchema: zod_1.z.object({
        bookings: zod_1.z.array(zod_1.z.object({
            bookingId: zod_1.z.string(),
            status: zod_1.z.string(),
            totalAmount: zod_1.z.number(),
            route: zod_1.z.string(),
            departureTime: zod_1.z.string(),
            createdAt: zod_1.z.string(),
        })),
    }),
    execute: (0, tool_wrapper_1.wrapToolExecute)(baseExecute, {
        toolName: 'get-user-bookings',
        allowedInputKeys: [],
        summarizeOutput: (output) => ({ count: output?.bookings?.length || 0 }),
    }),
});
