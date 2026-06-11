import Reel from '../models/Reel.js';

// @desc    Get all reels
// @route   GET /api/reels
// @access  Public
export const getReels = async (req, res) => {
  try {
    const reels = await Reel.find({}).sort({ createdAt: -1 });
    res.json(reels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new reel
// @route   POST /api/reels
// @access  Private
export const createReel = async (req, res) => {
  const { title, category, url, quiz } = req.body;

  try {
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
