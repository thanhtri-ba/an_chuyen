"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiResponse = void 0;
const ai_tools_1 = require("./ai.tools");
const ai_prompt_1 = require("./ai.prompt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
const generateAiResponse = async (message, userId) => {
    // 1. Build RAG Context based on the message
    const context = await (0, ai_tools_1.buildContext)(message, userId);
    // 2. Generate System Prompt with context
    const systemPrompt = (0, ai_prompt_1.getSystemPrompt)(context);
    // 3. Call Ollama Local API
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            stream: false
        })
    });
    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }
    const data = await response.json();
    return {
        reply: data.message.content,
        suggestions: [
            "Tìm chuyến đi Đà Lạt",
            "Quy định hành lý",
            "Kiểm tra vé của tôi"
        ]
    };
};
exports.generateAiResponse = generateAiResponse;
