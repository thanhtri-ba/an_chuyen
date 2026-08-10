import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class LoyaltyService {
  static async getLoyaltyInfo(userId: string) {
    let loyalty = await prisma.loyalty.findUnique({
      where: { userId },
      include: {
        user: { select: { loyaltyHistories: { orderBy: { createdAt: "desc" }, take: 10 } } }
      }
    });

    if (!loyalty) {
      loyalty = await prisma.loyalty.create({
        data: {
          userId,
          points: 0,
          tier: "Silver"
        },
        include: {
          user: { select: { loyaltyHistories: true } }
        }
      });
    }

    return loyalty;
  }

  static async addPoints(userId: string, points: number, reason: string) {
    const loyalty = await prisma.loyalty.upsert({
      where: { userId },
      update: { points: { increment: points } },
      create: { userId, points, tier: "Silver" }
    });

    // Update tier based on points
    let newTier = loyalty.tier;
    if (loyalty.points >= 5000) newTier = "Diamond";
    else if (loyalty.points >= 2000) newTier = "Gold";

    if (newTier !== loyalty.tier) {
      await prisma.loyalty.update({
        where: { userId },
        data: { tier: newTier }
      });
    }

    const history = await prisma.loyaltyHistory.create({
      data: {
        userId,
        points,
        reason
      }
    });

    return { loyalty: { ...loyalty, tier: newTier }, history };
  }
}
