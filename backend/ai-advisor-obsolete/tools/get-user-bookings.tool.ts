import { wrapToolExecute } from '../utils/tool-wrapper';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const baseExecute = async (input: any, context?: any) => {
  const requestContext = context?.requestContext;
  const userId = requestContext?.get('userId');
  if (!userId) {
    throw new Error('User is not authenticated');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: userId as string,
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

export const getUserBookingsTool = createTool({
  id: 'get-user-bookings',
  description: 'Lấy lịch sử đặt vé gần đây của người dùng hiện tại đang đăng nhập.',
  inputSchema: z.object({}),
  outputSchema: z.object({
    bookings: z.array(
      z.object({
        bookingId: z.string(),
        status: z.string(),
        totalAmount: z.number(),
        route: z.string(),
        departureTime: z.string(),
        createdAt: z.string(),
      })
    ),
  }),
  execute: wrapToolExecute(baseExecute as any, {
    toolName: 'get-user-bookings',
    allowedInputKeys: [],
    summarizeOutput: (output: any) => ({ count: output?.bookings?.length || 0 }),
  }),
});
