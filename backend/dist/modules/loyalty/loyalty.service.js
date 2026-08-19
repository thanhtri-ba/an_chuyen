"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LoyaltyService {
    static async getLoyaltyInfo(userId) {
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
    static async addPoints(userId, points, reason) {
        const loyalty = await prisma.loyalty.upsert({
            where: { userId },
            update: { points: { increment: points } },
            create: { userId, points, tier: "Silver" }
        });
        // Update tier based on points
        let newTier = loyalty.tier;
        if (loyalty.points >= 5000)
            newTier = "Diamond";
        else if (loyalty.points >= 2000)
            newTier = "Gold";
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
exports.LoyaltyService = LoyaltyService;
