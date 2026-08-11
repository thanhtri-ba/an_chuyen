"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTripsTool = void 0;
const tool_wrapper_1 = require("../utils/tool-wrapper");
const tools_1 = require("@mastra/core/tools");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const baseExecute = async ({ departureCity, arrivalCity, departureDate }) => {
    const startDate = new Date(`${departureDate}T00:00:00.000Z`);
    const endDate = new Date(`${departureDate}T23:59:59.999Z`);
    const schedules = await prisma.tripSchedule.findMany({
        where: {
            departureTime: {
                gte: startDate,
                lte: endDate,
            },
            trip: {
                route: {
                    departureCity: {
                        name: {
                            contains: departureCity,
                            mode: 'insensitive',
                        },
                    },
                    arrivalCity: {
                        name: {
                            contains: arrivalCity,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        },
        select: {
            id: true,
            departureTime: true,
            arrivalTime: true,
            durationMins: true,
            prices: {
                select: {
                    seatClass: true,
                    price: true,
                },
            },
            trip: {
                select: {
                    busAgent: {
                        select: {
                            name: true,
                        },
                    },
                    route: {
                        select: {
                            departureCity: { select: { name: true } },
                            arrivalCity: { select: { name: true } },
                        },
                    },
                },
            },
        },
        orderBy: {
            departureTime: 'asc',
        },
        take: 10,
    });
    return {
        trips: schedules.map((s) => ({
            tripScheduleId: s.id,
            busAgentName: s.trip.busAgent.name,
            route: `${s.trip.route.departureCity.name} -> ${s.trip.route.arrivalCity.name}`,
            departureTime: s.departureTime.toISOString(),
            arrivalTime: s.arrivalTime.toISOString(),
            durationMins: s.durationMins,
            prices: s.prices.map((p) => `${p.seatClass}: ${p.price} VNĐ`),
        })),
    };
};
exports.searchTripsTool = (0, tools_1.createTool)({
    id: 'search-trips',
    description: 'Tìm kiếm các chuyến xe liên tỉnh dựa trên điểm đi, điểm đến và ngày khởi hành.',
    inputSchema: zod_1.z.object({
        departureCity: zod_1.z.string().min(1).describe('Tên thành phố xuất phát (ví dụ: Hồ Chí Minh, Đà Lạt)'),
        arrivalCity: zod_1.z.string().min(1).describe('Tên thành phố điểm đến (ví dụ: Đà Lạt, Hồ Chí Minh)'),
        departureDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Ngày khởi hành định dạng YYYY-MM-DD'),
    }),
    outputSchema: zod_1.z.object({
        trips: zod_1.z.array(zod_1.z.object({
            tripScheduleId: zod_1.z.string(),
            busAgentName: zod_1.z.string(),
            route: zod_1.z.string(),
            departureTime: zod_1.z.string(),
            arrivalTime: zod_1.z.string(),
            durationMins: zod_1.z.number(),
            prices: zod_1.z.array(zod_1.z.string()),
        })),
    }),
    execute: (0, tool_wrapper_1.wrapToolExecute)(baseExecute, {
        toolName: 'search-trips',
        allowedInputKeys: ['departureCity', 'arrivalCity', 'departureDate'],
        summarizeOutput: (output) => ({ count: output?.trips?.length || 0 }),
    }),
});
