import express from 'express';
import { getCampaigns, createCampaign, joinCampaign, checkinCampaign } from '../controllers/campaignController.js';
import { protect, ngo } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(protect, ngo, createCampaign);

router.post('/:id/join', protect, joinCampaign);
router.post('/:id/checkin', protect, checkinCampaign);

export default router;
