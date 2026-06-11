import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Digital Wellbeing', 'Cyber Safety', 'Mental Health', 'Environmental', 'Financial Literacy', 'Road Safety', 'Social Responsibility', 'Health & Fitness'] 
  },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoName: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedInAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  pointsReward: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model('Campaign', CampaignSchema);
export default Campaign;
