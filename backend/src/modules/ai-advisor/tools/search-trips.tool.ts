import { wrapToolExecute } from '../utils/tool-wrapper';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const baseExecute = async ({ departureCity, arrivalCity, departureDate }: { departureCity: string; arrivalCity: string; departureDate: string }) => {
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

export const searchTripsTool = createTool({
  id: 'search-trips',
  description: 'Tìm kiếm các chuyến xe liên tỉnh dựa trên điểm đi, điểm đến và ngày khởi hành.',
  inputSchema: z.object({
    departureCity: z.string().min(1).describe('Tên thành phố xuất phát (ví dụ: Hồ Chí Minh, Đà Lạt)'),
    arrivalCity: z.string().min(1).describe('Tên thành phố điểm đến (ví dụ: Đà Lạt, Hồ Chí Minh)'),
    departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Ngày khởi hành định dạng YYYY-MM-DD'),
  }),
  outputSchema: z.object({
    trips: z.array(
      z.object({
        tripScheduleId: z.string(),
        busAgentName: z.string(),
        route: z.string(),
        departureTime: z.string(),
        arrivalTime: z.string(),
        durationMins: z.number(),
        prices: z.array(z.string()),
      })
    ),
  }),
  execute: wrapToolExecute(baseExecute as any, {
    toolName: 'search-trips',
    allowedInputKeys: ['departureCity', 'arrivalCity', 'departureDate'],
    summarizeOutput: (output: any) => ({ count: output?.trips?.length || 0 }),
  }),
});
