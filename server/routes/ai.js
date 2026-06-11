import express from 'express';
import { getAIChatResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, getAIChatResponse);

export default router;
