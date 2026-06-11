import mongoose from 'mongoose';

const ActionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType: { 
    type: String, 
    required: true,
    enum: ['quiz', 'campaign_join', 'campaign_attend', 'detox_goal', 'challenge_complete', 'feed_share'] 
  },
  category: { type: String, required: true },
  description: { type: String, required: true },
  pointsEarned: { type: Number, default: 0 },
  socialImpactMetrics: {
    treesPlanted: { type: Number, default: 0 },
    plasticRecycledKg: { type: Number, default: 0 },
    volunteerHours: { type: Number, default: 0 },
    screenTimeReducedMins: { type: Number, default: 0 }
  },
  timestamp: { type: Date, default: Date.now }
});

const ActionLog = mongoose.model('ActionLog', ActionLogSchema);
export default ActionLog;
