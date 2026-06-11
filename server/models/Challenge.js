import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  pointsReward: { type: Number, default: 50 },
  durationDays: { type: Number, default: 1 },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'submitted', 'verified', 'failed'], default: 'active' },
    proofImage: String,
    proofVideo: String,
    notes: String,
    submittedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

const Challenge = mongoose.model('Challenge', ChallengeSchema);
export default Challenge;
