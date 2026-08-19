"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyController = void 0;
const loyalty_service_1 = require("./loyalty.service");
class LoyaltyController {
    static async getMyLoyalty(req, res) {
        try {
            const userId = req.user?.id; // Assuming auth middleware attaches user
            if (!userId)
                return res.status(401).json({ error: "Unauthorized" });
            const loyalty = await loyalty_service_1.LoyaltyService.getLoyaltyInfo(userId);
            res.json({ success: true, data: loyalty });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async addPoints(req, res) {
        try {
            const { userId, points, reason } = req.body;
            if (!userId || !points || !reason) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            const result = await loyalty_service_1.LoyaltyService.addPoints(userId, points, reason);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.LoyaltyController = LoyaltyController;
