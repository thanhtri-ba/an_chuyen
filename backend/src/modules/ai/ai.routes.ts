import { Router } from 'express';
import { chatWithAi } from './ai.controller';

const router = Router();

// Endpoint for AI chat
router.post('/chat', chatWithAi);

export default router;
