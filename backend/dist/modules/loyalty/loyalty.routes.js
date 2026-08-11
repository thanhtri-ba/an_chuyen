"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loyaltyRoutes = void 0;
const express_1 = require("express");
const loyalty_controller_1 = require("./loyalty.controller");
// import { authMiddleware } from "../../middleware/auth"; 
// Note: You need to apply your actual auth middleware here
const router = (0, express_1.Router)();
// Lấy thông tin điểm thưởng của user hiện tại
// router.get("/me", authMiddleware, LoyaltyController.getMyLoyalty);
router.get("/me", loyalty_controller_1.LoyaltyController.getMyLoyalty);
// Thêm điểm (Cần bảo mật, ví dụ admin hoặc nội bộ server gọi)
router.post("/add", loyalty_controller_1.LoyaltyController.addPoints);
exports.loyaltyRoutes = router;
