"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Lớp 3: Idempotency có thể được xử lý thêm, hiện tại tập trung Lớp 1 và 2.
router.post('/create', auth_middleware_1.verifyAccessToken, booking_controller_1.createBooking);
router.get('/', auth_middleware_1.verifyAccessToken, booking_controller_1.getBookings);
exports.default = router;
