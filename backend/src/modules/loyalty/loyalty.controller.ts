import { Request, Response } from "express";
import { LoyaltyService } from "./loyalty.service";

export class LoyaltyController {
  static async getMyLoyalty(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const loyalty = await LoyaltyService.getLoyaltyInfo(userId);
      res.json({ success: true, data: loyalty });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addPoints(req: Request, res: Response) {
    try {
      const { userId, points, reason } = req.body;
      if (!userId || !points || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await LoyaltyService.addPoints(userId, points, reason);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
