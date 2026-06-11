import express from 'express';
import { getChallenges, joinChallenge, submitChallengeProof, verifyChallenge } from '../controllers/challengeController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getChallenges);
router.post('/:id/join', protect, joinChallenge);
router.post('/:id/submit', protect, submitChallengeProof);
router.post('/:id/verify/:userId', protect, admin, verifyChallenge);

export default router;
