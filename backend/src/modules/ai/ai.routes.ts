import { Router } from 'express';
import { chatWithAi } from './ai.controller';
import { restrictToApp } from '../../middleware/app-only.middleware';

const router = Router();

// Endpoint for AI chat (only accessible from the mobile app)
router.post('/chat', restrictToApp, chatWithAi);

export default router;
