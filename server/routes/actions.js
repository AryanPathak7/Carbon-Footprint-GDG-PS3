import express from 'express';
import { logScreenTime, getImpactMetrics, getLeaderboard, logCustomAction } from '../controllers/actionEngineController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/detox/log', protect, logScreenTime);
router.get('/impact', protect, getImpactMetrics);
router.get('/leaderboard', getLeaderboard);
router.post('/log', protect, logCustomAction);

export default router;
