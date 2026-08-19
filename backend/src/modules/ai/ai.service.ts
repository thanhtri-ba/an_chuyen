import { buildContext } from './ai.tools';
import { getSystemPrompt } from './ai.prompt';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

export const generateAiResponse = async (message: string, userId?: string) => {
  // 1. Build RAG Context based on the message
  const context = await buildContext(message, userId);
  
  // 2. Generate System Prompt with context
  const systemPrompt = getSystemPrompt(context);

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
