import { Router } from "express";
import { LoyaltyController } from "./loyalty.controller";
// import { authMiddleware } from "../../middleware/auth"; 
// Note: You need to apply your actual auth middleware here

const router = Router();

// Lấy thông tin điểm thưởng của user hiện tại
// router.get("/me", authMiddleware, LoyaltyController.getMyLoyalty);
router.get("/me", LoyaltyController.getMyLoyalty);

// Thêm điểm (Cần bảo mật, ví dụ admin hoặc nội bộ server gọi)
router.post("/add", LoyaltyController.addPoints);

export const loyaltyRoutes = router;
