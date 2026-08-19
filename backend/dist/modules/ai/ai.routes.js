"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const app_only_middleware_1 = require("../../middleware/app-only.middleware");
const router = (0, express_1.Router)();
// Endpoint for AI chat (only accessible from the mobile app)
router.post('/chat', app_only_middleware_1.restrictToApp, ai_controller_1.chatWithAi);
exports.default = router;
