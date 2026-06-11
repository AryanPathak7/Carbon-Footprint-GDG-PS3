import express from 'express';
import { getReels, createReel } from '../controllers/reelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getReels)
  .post(protect, createReel);

export default router;
