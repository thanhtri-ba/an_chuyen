import { Request, Response } from 'express';
import { generateAiResponse } from './ai.service';

export const chatWithAi = async (req: Request, res: Response) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await generateAiResponse(message, userId);
    return res.json(result);
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      error: 'Cannot connect to AI service',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
