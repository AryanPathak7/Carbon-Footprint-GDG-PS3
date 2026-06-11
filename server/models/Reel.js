import mongoose from 'mongoose';

const ReelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  quiz: {
    question: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: Number, required: true },
    explanation: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

const Reel = mongoose.model('Reel', ReelSchema);
export default Reel;
