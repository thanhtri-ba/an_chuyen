import { wrapToolExecute } from '../utils/tool-wrapper';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const baseExecute = async ({ busAgentName }: { busAgentName?: string }) => {
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

export const getPoliciesTool = createTool({
  id: 'get-policies',
  description: 'Tra cứu chính sách hủy vé, hoàn tiền của các nhà xe khách trên hệ thống.',
  inputSchema: z.object({
    busAgentName: z.string().optional().describe('Tên nhà xe cụ thể cần tra cứu chính sách (ví dụ: Phương Trang, Thành Bưởi)'),
  }),
  outputSchema: z.object({
    policies: z.array(
      z.object({
        busAgentName: z.string(),
        hoursBefore: z.number(),
        refundPercentage: z.number(),
      })
    ),
  }),
  execute: wrapToolExecute(baseExecute as any, {
    toolName: 'get-policies',
    allowedInputKeys: ['busAgentName'],
    summarizeOutput: (output: any) => ({ count: output?.policies?.length || 0 }),
  }),
});
