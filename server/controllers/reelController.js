import mongoose from 'mongoose';
import Reel from '../models/Reel.js';
import { mockReels } from '../config/mockStore.js';

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
export const getReels = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Fetching mock reels.");
      return res.json(mockReels);
    }
    const reels = await Reel.find({}).sort({ createdAt: -1 });
    // Seed database with mockReels if it is empty
    if (reels.length === 0) {
      const seeded = await Reel.insertMany(mockReels);
      return res.json(seeded);
    }
    res.json(reels);
  } catch (error) {
    console.error("Database fetch reels failed. Falling back to mock data.", error.message);
    res.json(mockReels);
  }
};

// @desc    Create a new reel
// @route   POST /api/reels
// @access  Private
export const createReel = async (req, res) => {
  const { title, category, url, quiz } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Creating mock reel.");
      const mockReel = {
        _id: 'reel_' + Date.now(),
        title,
        category,
        url,
        quiz: {
          question: quiz?.question || '',
          options: quiz?.options || [],
          answer: Number(quiz?.answer) || 0,
          explanation: quiz?.explanation || ''
        },
        likes: 0,
        saves: 0,
        createdAt: new Date()
      };
      mockReels.unshift(mockReel);
      return res.status(201).json(mockReel);
    }

    const reel = new Reel({
      title,
      category,
      url,
      quiz
    });

    const createdReel = await reel.save();
    res.status(201).json(createdReel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
