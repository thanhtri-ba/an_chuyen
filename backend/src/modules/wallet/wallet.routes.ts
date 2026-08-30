import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { verifyAccessToken } from "../../middleware/auth.middleware";

const router = Router();

// Lấy thông tin ví của user hiện tại
router.get("/me", verifyAccessToken as any, WalletController.getMyWallet);

export const walletRoutes = router;
