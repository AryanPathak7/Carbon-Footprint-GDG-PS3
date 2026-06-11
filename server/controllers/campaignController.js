import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import ActionLog from '../models/ActionLog.js';
import { mockCampaigns, mockUsers, mockActionLogs } from '../config/mockStore.js';

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Fetching mock campaigns.");
      return res.json(mockCampaigns);
    }
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error("Database fetch campaigns failed. Falling back to mock data.", error.message);
    res.json(mockCampaigns);
  }
};

// @desc    Create a campaign
// @route   POST /api/campaigns
// @access  Private/NGO
export const createCampaign = async (req, res) => {
  const { title, description, category, lat, lng, address, startDate, endDate, pointsReward } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Creating mock campaign.");
      const mockCampaign = {
        _id: 'camp_' + Date.now(),
        title,
        description,
        category,
        ngoId: req.user._id,
        ngoName: req.user.name,
        location: {
          lat: Number(lat),
          lng: Number(lng),
          address
        },
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        volunteers: [],
        attendance: [],
        status: 'active',
        pointsReward: Number(pointsReward) || 100,
        createdAt: new Date()
      };
      mockCampaigns.unshift(mockCampaign);
      return res.status(201).json(mockCampaign);
    }

    const campaign = new Campaign({
      title,
      description,
      category,
      ngoId: req.user._id,
      ngoName: req.user.name,
      location: {
        lat: Number(lat),
        lng: Number(lng),
        address
      },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pointsReward: pointsReward || 100
    });

    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a campaign as a volunteer
// @route   POST /api/campaigns/:id/join
// @access  Private/Citizen
export const joinCampaign = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Joining mock campaign.");
      const campaign = mockCampaigns.find(c => c._id === req.params.id);

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      if (campaign.volunteers.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already signed up for this campaign' });
      }

      campaign.volunteers.push(req.user._id);

      // Log volunteer interest in action engine in memory
      mockActionLogs.push({
        _id: 'act_' + Date.now(),
        userId: req.user._id,
        actionType: 'campaign_join',
        category: campaign.category,
        description: `Joined campaign: ${campaign.title}`,
        pointsEarned: 10,
        socialImpactMetrics: {
          treesPlanted: 0,
          plasticRecycledKg: 0,
          volunteerHours: 0,
          screenTimeReducedMins: 0
        },
        timestamp: new Date()
      });

      // Update user points in memory
      const user = mockUsers.find(u => u._id === req.user._id) || req.user;
      user.points = (user.points || 0) + 10;

      return res.json({ message: 'Successfully registered for campaign', campaign });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.volunteers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already signed up for this campaign' });
    }

    campaign.volunteers.push(req.user._id);
    await campaign.save();

    // Log volunteer interest in action engine
    await ActionLog.create({
      userId: req.user._id,
      actionType: 'campaign_join',
      category: campaign.category,
      description: `Joined campaign: ${campaign.title}`,
      pointsEarned: 10, // Small points for registering interest
      socialImpactMetrics: {
        treesPlanted: 0,
        plasticRecycledKg: 0,
        volunteerHours: 0,
        screenTimeReducedMins: 0
      }
    });

    // Update user points
    const user = await User.findById(req.user._id);
    user.points += 10;
    await user.save();

    res.json({ message: 'Successfully registered for campaign', campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check-in/Attendance confirmation (Simulated QR verification)
// @route   POST /api/campaigns/:id/checkin
// @access  Private/Citizen
export const checkinCampaign = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Checking in mock campaign.");
      const campaign = mockCampaigns.find(c => c._id === req.params.id);

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      const isVolunteered = campaign.volunteers.includes(req.user._id);
      const isAlreadyCheckedIn = campaign.attendance.some(
        (att) => att.userId === req.user._id
      );

      if (isAlreadyCheckedIn) {
        return res.status(400).json({ message: 'Already checked in' });
      }

      // Add attendance
      campaign.attendance.push({ userId: req.user._id, checkedInAt: new Date() });
      
      // Add to volunteers list if not already signed up
      if (!isVolunteered) {
        campaign.volunteers.push(req.user._id);
      }

      // Reward points and log impact
      const hoursEarned = 3;
      const user = mockUsers.find(u => u._id === req.user._id) || req.user;
      user.points = (user.points || 0) + campaign.pointsReward;
      
      // Upgrade level if criteria met
      if (user.points > 1000) user.level = 'Awareness Champion';
      else if (user.points > 500) user.level = 'Influencer';
      else if (user.points > 250) user.level = 'Contributor';
      else if (user.points > 100) user.level = 'Learner';

      // Log impact in memory
      mockActionLogs.push({
        _id: 'act_' + Date.now(),
        userId: req.user._id,
        actionType: 'campaign_attend',
        category: campaign.category,
        description: `Attended and completed volunteer hours for campaign: ${campaign.title}`,
        pointsEarned: campaign.pointsReward,
        socialImpactMetrics: {
          treesPlanted: campaign.category === 'Environmental' ? 1 : 0,
          plasticRecycledKg: campaign.category === 'Environmental' ? 2 : 0,
          volunteerHours: hoursEarned,
          screenTimeReducedMins: 180
        },
        timestamp: new Date()
      });

      return res.json({ 
        message: 'Attendance checked in successfully. Rewards updated!', 
        pointsReward: campaign.pointsReward,
        newPoints: user.points,
        newLevel: user.level
      });
    }

    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const isVolunteered = campaign.volunteers.includes(req.user._id);
    const isAlreadyCheckedIn = campaign.attendance.some(
      (att) => att.userId.toString() === req.user._id.toString()
    );

    if (isAlreadyCheckedIn) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    // Add attendance
    campaign.attendance.push({ userId: req.user._id, checkedInAt: new Date() });
    
    // Add to volunteers list if not already signed up
    if (!isVolunteered) {
      campaign.volunteers.push(req.user._id);
    }

    await campaign.save();

    // Reward points and log impact
    const hoursEarned = 3; // Standard volunteer block
    const user = await User.findById(req.user._id);
    user.points += campaign.pointsReward;
    
    // Upgrade level if criteria met
    if (user.points > 1000) user.level = 'Awareness Champion';
    else if (user.points > 500) user.level = 'Influencer';
    else if (user.points > 250) user.level = 'Contributor';
    else if (user.points > 100) user.level = 'Learner';

    await user.save();

    // Log impact
    await ActionLog.create({
      userId: req.user._id,
      actionType: 'campaign_attend',
      category: campaign.category,
      description: `Attended and completed volunteer hours for campaign: ${campaign.title}`,
      pointsEarned: campaign.pointsReward,
      socialImpactMetrics: {
        treesPlanted: campaign.category === 'Environmental' ? 1 : 0,
        plasticRecycledKg: campaign.category === 'Environmental' ? 2 : 0,
        volunteerHours: hoursEarned,
        screenTimeReducedMins: 180 // Standard time during campaign activity
      }
    });

    res.json({ 
      message: 'Attendance checked in successfully. Rewards updated!', 
      pointsReward: campaign.pointsReward,
      newPoints: user.points,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
