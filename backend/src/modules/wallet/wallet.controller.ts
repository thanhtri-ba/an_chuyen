import { Request, Response } from "express";
import { WalletService } from "./wallet.service";

export class WalletController {
  static async getMyWallet(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const wallet = await WalletService.getWalletInfo(userId);
      res.json({ success: true, data: wallet });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
