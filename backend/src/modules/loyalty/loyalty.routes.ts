import { Router } from "express";
import { LoyaltyController } from "./loyalty.controller";
import { verifyAccessToken } from "../../middleware/auth.middleware";

const router = Router();

// Lấy thông tin điểm thưởng của user hiện tại
router.get("/me", verifyAccessToken as any, LoyaltyController.getMyLoyalty);

// Thêm điểm (Cần bảo mật, ví dụ admin hoặc nội bộ server gọi)
router.post("/add", LoyaltyController.addPoints);

export const loyaltyRoutes = router;
