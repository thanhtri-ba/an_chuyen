"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAi = void 0;
const ai_service_1 = require("./ai.service");
const chatWithAi = async (req, res) => {
    try {
        const { message, userId } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const result = await (0, ai_service_1.generateAiResponse)(message, userId);
        return res.json(result);
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        return res.status(500).json({
            error: 'Cannot connect to AI service',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.chatWithAi = chatWithAi;
