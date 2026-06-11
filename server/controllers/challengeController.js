import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import ActionLog from '../models/ActionLog.js';
import { mockChallenges, mockUsers, mockActionLogs } from '../config/mockStore.js';

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Private
export const getChallenges = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Fetching mock challenges.");
      return res.json(mockChallenges);
    }

    const challenges = await Challenge.find({});
    
    // Seed initial challenges if empty
    if (challenges.length === 0) {
      const defaultChallenges = await Challenge.insertMany([
        {
          title: 'No Social Media Sunday',
          description: 'Spend your Sunday completely off social media to reset your digital health.',
          category: 'Digital Wellbeing',
          pointsReward: 80,
          durationDays: 1
        },
        {
          title: 'Plant a Tree',
          description: 'Plant a sapling in your local community, take a picture, and upload it.',
          category: 'Environmental',
          pointsReward: 120,
          durationDays: 7
        },
        {
          title: 'Walk 5000 Steps Daily',
          description: 'Keep physically active by walking at least 5000 steps every day for a week.',
          category: 'Health & Fitness',
          pointsReward: 100,
          durationDays: 7
        },
        {
          title: 'Help an Elderly Neighbor',
          description: 'Assist a senior citizen in your neighborhood with groceries, tech support, or companionship.',
          category: 'Social Responsibility',
          pointsReward: 150,
          durationDays: 3
        }
      ]);
      return res.json(defaultChallenges);
    }
    
    res.json(challenges);
  } catch (error) {
    console.error("Database fetch challenges failed. Falling back to mock data.", error.message);
    res.json(mockChallenges);
  }
};

// @desc    Join/Accept a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
export const joinChallenge = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Joining mock challenge.");
      const challenge = mockChallenges.find(c => c._id === req.params.id);

      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      const isParticipating = challenge.participants.some(
        (p) => p.userId === req.user._id
      );

      if (isParticipating) {
        return res.status(400).json({ message: 'Already accepted this challenge' });
      }

      challenge.participants.push({
        userId: req.user._id,
        status: 'active'
      });

      return res.json({ message: 'Challenge accepted!', challenge });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const isParticipating = challenge.participants.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (isParticipating) {
      return res.status(400).json({ message: 'Already accepted this challenge' });
    }

    challenge.participants.push({
      userId: req.user._id,
      status: 'active'
    });

    await challenge.save();
    res.json({ message: 'Challenge accepted!', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit proof for challenge completion
// @route   POST /api/challenges/:id/submit
// @access  Private
export const submitChallengeProof = async (req, res) => {
  const { proofImage, proofVideo, notes } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Submitting proof for mock challenge.");
      const challenge = mockChallenges.find(c => c._id === req.params.id);

      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      const participant = challenge.participants.find(
        (p) => p.userId === req.user._id
      );

      if (!participant) {
        return res.status(400).json({ message: 'You have not joined this challenge yet' });
      }

      participant.status = 'submitted';
      participant.proofImage = proofImage || 'proof_placeholder.jpg';
      participant.proofVideo = proofVideo || '';
      participant.notes = notes || '';
      participant.submittedAt = new Date();

      return res.json({ message: 'Challenge proof submitted. Awaiting verification!', challenge });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ message: 'You have not joined this challenge yet' });
    }

    participant.status = 'submitted';
    participant.proofImage = proofImage || 'proof_placeholder.jpg';
    participant.proofVideo = proofVideo || '';
    participant.notes = notes || '';
    participant.submittedAt = new Date();

    await challenge.save();
    res.json({ message: 'Challenge proof submitted. Awaiting verification!', challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify challenge proof (Admin only)
// @route   POST /api/challenges/:id/verify/:userId
// @access  Private/Admin
export const verifyChallenge = async (req, res) => {
  const { status } = req.body; // 'verified' or 'failed'

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Verifying mock challenge proof.");
      const challenge = mockChallenges.find(c => c._id === req.params.id);

      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      const participant = challenge.participants.find(
        (p) => p.userId === req.params.userId
      );

      if (!participant) {
        return res.status(404).json({ message: 'User is not a participant in this challenge' });
      }

      participant.status = status;

      if (status === 'verified') {
        const user = mockUsers.find(u => u._id === req.params.userId);
        if (user) {
          user.points = (user.points || 0) + challenge.pointsReward;
          
          // Update levels
          if (user.points > 1000) user.level = 'Awareness Champion';
          else if (user.points > 500) user.level = 'Influencer';
          else if (user.points > 250) user.level = 'Contributor';
          else if (user.points > 100) user.level = 'Learner';
        }

        // Log impact based on category
        let trees = 0, plastic = 0, hours = 0, detoxMins = 0;
        if (challenge.category === 'Environmental') {
          trees = challenge.title.includes('Tree') ? 1 : 0;
          plastic = challenge.title.includes('Cleanup') ? 5 : 1;
        } else if (challenge.category === 'Social Responsibility') {
          hours = 2;
        } else if (challenge.category === 'Digital Wellbeing') {
          detoxMins = 300; // 5 hours detox credit
        }

        mockActionLogs.push({
          _id: 'act_' + Date.now(),
          userId: req.params.userId,
          actionType: 'challenge_complete',
          category: challenge.category,
          description: `Completed challenge: ${challenge.title}`,
          pointsEarned: challenge.pointsReward,
          socialImpactMetrics: {
            treesPlanted: trees,
            plasticRecycledKg: plastic,
            volunteerHours: hours,
            screenTimeReducedMins: detoxMins
          },
          timestamp: new Date()
        });
      }

      return res.json({ message: `Challenge status updated to: ${status}`, challenge });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      (p) => p.userId.toString() === req.params.userId.toString()
    );

    if (!participant) {
      return res.status(404).json({ message: 'User is not a participant in this challenge' });
    }

    participant.status = status;
    await challenge.save();

    if (status === 'verified') {
      const user = await User.findById(req.params.userId);
      user.points += challenge.pointsReward;
      
      // Update levels
      if (user.points > 1000) user.level = 'Awareness Champion';
      else if (user.points > 500) user.level = 'Influencer';
      else if (user.points > 250) user.level = 'Contributor';
      else if (user.points > 100) user.level = 'Learner';
      
      await user.save();

      // Log impact based on category
      let trees = 0, plastic = 0, hours = 0, detoxMins = 0;
      if (challenge.category === 'Environmental') {
        trees = challenge.title.includes('Tree') ? 1 : 0;
        plastic = challenge.title.includes('Cleanup') ? 5 : 1;
      } else if (challenge.category === 'Social Responsibility') {
        hours = 2;
      } else if (challenge.category === 'Digital Wellbeing') {
        detoxMins = 300; // 5 hours detox credit
      }

      await ActionLog.create({
        userId: user._id,
        actionType: 'challenge_complete',
        category: challenge.category,
        description: `Completed challenge: ${challenge.title}`,
        pointsEarned: challenge.pointsReward,
        socialImpactMetrics: {
          treesPlanted: trees,
          plasticRecycledKg: plastic,
          volunteerHours: hours,
          screenTimeReducedMins: detoxMins
        }
      });
    }

    res.json({ message: `Challenge status updated to: ${status}`, challenge });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
