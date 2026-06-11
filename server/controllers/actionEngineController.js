import mongoose from 'mongoose';
import ActionLog from '../models/ActionLog.js';
import User from '../models/User.js';
import { mockActionLogs, mockUsers } from '../config/mockStore.js';

// @desc    Log screen time and calculate detox trends
// @route   POST /api/detox/log
// @access  Private
export const logScreenTime = async (req, res) => {
  const { date, duration } = req.body; // duration in minutes

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Logging mock screen time.");
      const user = mockUsers.find(u => u._id === req.user._id) || req.user;

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add or update log for that date
      const logIndex = user.digitalDetox.screenTimeLogs.findIndex((log) => log.date === date);
      
      if (logIndex > -1) {
        user.digitalDetox.screenTimeLogs[logIndex].duration = duration;
      } else {
        user.digitalDetox.screenTimeLogs.push({ date, duration });
      }

      // Check if user reduced screen time relative to goal or average
      const targetGoal = user.digitalDetox.screenTimeGoal || 180;
      let screenTimeReduced = 0;
      let pointsEarned = 0;
      
      if (duration < targetGoal) {
        screenTimeReduced = targetGoal - duration;
        pointsEarned = 20;
        user.points = (user.points || 0) + 20;

        // Log action in Awareness-to-Action Engine in memory
        mockActionLogs.push({
          _id: 'act_' + Date.now(),
          userId: user._id,
          actionType: 'detox_goal',
          category: 'Digital Wellbeing',
          description: `Reduced screen time to ${duration} mins (Goal: ${targetGoal} mins)`,
          pointsEarned: 20,
          socialImpactMetrics: {
            treesPlanted: 0,
            plasticRecycledKg: 0,
            volunteerHours: 0,
            screenTimeReducedMins: screenTimeReduced
          },
          timestamp: new Date()
        });
      }

      return res.json({
        message: 'Screen time logged successfully',
        digitalDetox: user.digitalDetox,
        pointsEarned
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add or update log for that date
    const logIndex = user.digitalDetox.screenTimeLogs.findIndex((log) => log.date === date);
    let previousDuration = 0;
    
    if (logIndex > -1) {
      previousDuration = user.digitalDetox.screenTimeLogs[logIndex].duration;
      user.digitalDetox.screenTimeLogs[logIndex].duration = duration;
    } else {
      user.digitalDetox.screenTimeLogs.push({ date, duration });
    }

    await user.save();

    // Check if user reduced screen time relative to goal or average
    const targetGoal = user.digitalDetox.screenTimeGoal || 180;
    let screenTimeReduced = 0;
    
    if (duration < targetGoal) {
      screenTimeReduced = targetGoal - duration;
      
      // Award points for meeting goals
      user.points += 20;
      await user.save();

      // Log action in Awareness-to-Action Engine
      await ActionLog.create({
        userId: user._id,
        actionType: 'detox_goal',
        category: 'Digital Wellbeing',
        description: `Reduced screen time to ${duration} mins (Goal: ${targetGoal} mins)`,
        pointsEarned: 20,
        socialImpactMetrics: {
          treesPlanted: 0,
          plasticRecycledKg: 0,
          volunteerHours: 0,
          screenTimeReducedMins: screenTimeReduced
        }
      });
    }

    res.json({
      message: 'Screen time logged successfully',
      digitalDetox: user.digitalDetox,
      pointsEarned: duration < targetGoal ? 20 : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's personal, community and global impact metrics
// @route   GET /api/actions/impact
// @access  Private
export const getImpactMetrics = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Calculating mock impact metrics.");
      
      // 1. Personal Impact in memory
      const personalLogs = mockActionLogs.filter(log => log.userId === req.user._id);
      const personalImpact = personalLogs.reduce(
        (acc, log) => {
          acc.treesPlanted += log.socialImpactMetrics.treesPlanted || 0;
          acc.plasticRecycledKg += log.socialImpactMetrics.plasticRecycledKg || 0;
          acc.volunteerHours += log.socialImpactMetrics.volunteerHours || 0;
          acc.screenTimeReducedMins += log.socialImpactMetrics.screenTimeReducedMins || 0;
          acc.points += log.pointsEarned || 0;
          return acc;
        },
        { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0, points: 0 }
      );

      // 2. Global Impact in memory
      const globalImpact = mockActionLogs.reduce(
        (acc, log) => {
          acc.treesPlanted += log.socialImpactMetrics.treesPlanted || 0;
          acc.plasticRecycledKg += log.socialImpactMetrics.plasticRecycledKg || 0;
          acc.volunteerHours += log.socialImpactMetrics.volunteerHours || 0;
          acc.screenTimeReducedMins += log.socialImpactMetrics.screenTimeReducedMins || 0;
          return acc;
        },
        { treesPlanted: 345, plasticRecycledKg: 1240, volunteerHours: 820, screenTimeReducedMins: 24500 } // Baseline seeds
      );

      return res.json({
        personal: personalImpact,
        global: globalImpact
      });
    }

    // 1. Personal Impact (current user)
    const personalLogs = await ActionLog.find({ userId: req.user._id });
    const personalImpact = personalLogs.reduce(
      (acc, log) => {
        acc.treesPlanted += log.socialImpactMetrics.treesPlanted || 0;
        acc.plasticRecycledKg += log.socialImpactMetrics.plasticRecycledKg || 0;
        acc.volunteerHours += log.socialImpactMetrics.volunteerHours || 0;
        acc.screenTimeReducedMins += log.socialImpactMetrics.screenTimeReducedMins || 0;
        acc.points += log.pointsEarned || 0;
        return acc;
      },
      { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0, points: 0 }
    );

    // 2. Global Impact (all users)
    const globalLogs = await ActionLog.find({});
    const globalImpact = globalLogs.reduce(
      (acc, log) => {
        acc.treesPlanted += log.socialImpactMetrics.treesPlanted || 0;
        acc.plasticRecycledKg += log.socialImpactMetrics.plasticRecycledKg || 0;
        acc.volunteerHours += log.socialImpactMetrics.volunteerHours || 0;
        acc.screenTimeReducedMins += log.socialImpactMetrics.screenTimeReducedMins || 0;
        return acc;
      },
      { treesPlanted: 345, plasticRecycledKg: 1240, volunteerHours: 820, screenTimeReducedMins: 24500 } // Baseline seed values
    );

    res.json({
      personal: personalImpact,
      global: globalImpact
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get School/College Leaderboards
// @route   GET /api/actions/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const seeds = [
      { rank: 1, name: 'National Institute of Technology', points: 4800, membersCount: 42, volunteerHours: 120 },
      { rank: 2, name: 'Greenwood High School', points: 3650, membersCount: 35, volunteerHours: 94 },
      { rank: 3, name: 'St. Xavier College', points: 3100, membersCount: 28, volunteerHours: 80 },
      { rank: 4, name: 'Delhi Public School', points: 2900, membersCount: 20, volunteerHours: 65 },
      { rank: 5, name: 'Model Senior Secondary School', points: 1200, membersCount: 15, volunteerHours: 30 }
    ];

    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Compiling mock leaderboard.");
      
      const schoolMap = {};
      // Add mock users to calculation
      mockUsers.forEach((user) => {
        const school = user.schoolId || '';
        if (school) {
          if (!schoolMap[school]) {
            schoolMap[school] = {
              name: school,
              points: 0,
              membersCount: 0,
              volunteerHours: 0
            };
          }
          schoolMap[school].points += user.points || 0;
          schoolMap[school].membersCount += 1;
        }
      });

      // Merge dynamic data with baseline seeds
      seeds.forEach((seed) => {
        if (!schoolMap[seed.name]) {
          schoolMap[seed.name] = {
            name: seed.name,
            points: seed.points,
            membersCount: seed.membersCount,
            volunteerHours: seed.volunteerHours
          };
        } else {
          // Accumulate points if they exist in mockStore
          schoolMap[seed.name].points += seed.points;
          schoolMap[seed.name].membersCount += seed.membersCount;
          schoolMap[seed.name].volunteerHours += seed.volunteerHours;
        }
      });

      const leaderboard = Object.values(schoolMap)
        .sort((a, b) => b.points - a.points)
        .map((item, idx) => ({
          rank: idx + 1,
          ...item
        }));

      return res.json(leaderboard);
    }

    // Query users aggregated by schoolId
    const users = await User.find({ schoolId: { $ne: '' } });
    
    // Group users by schoolId and calculate metrics
    const schoolMap = {};
    users.forEach((user) => {
      const school = user.schoolId || 'Unknown Institution';
      if (!schoolMap[school]) {
        schoolMap[school] = {
          name: school,
          points: 0,
          membersCount: 0,
          volunteerHours: 0
        };
      }
      schoolMap[school].points += user.points;
      schoolMap[school].membersCount += 1;
    });

    const leaderboard = Object.values(schoolMap)
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({
        rank: idx + 1,
        ...item
      }));

    // Seed data if database leaderboard is empty
    if (leaderboard.length === 0) {
      return res.json(seeds);
    }

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log a custom action (e.g. sharing feed, quiz completion, etc)
// @route   POST /api/actions/log
// @access  Private
export const logCustomAction = async (req, res) => {
  const { actionType, category, description, pointsEarned, socialImpactMetrics } = req.body;

  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Logging mock custom action.");
      const user = mockUsers.find(u => u._id === req.user._id) || req.user;
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.points = (user.points || 0) + (pointsEarned || 0);

      // Update levels
      if (user.points > 1000) user.level = 'Awareness Champion';
      else if (user.points > 500) user.level = 'Influencer';
      else if (user.points > 250) user.level = 'Contributor';
      else if (user.points > 100) user.level = 'Learner';

      const log = {
        _id: 'act_' + Date.now(),
        userId: user._id,
        actionType,
        category,
        description,
        pointsEarned,
        socialImpactMetrics: socialImpactMetrics || { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 },
        timestamp: new Date()
      };

      mockActionLogs.push(log);

      return res.status(201).json({ log, newPoints: user.points, newLevel: user.level });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.points += pointsEarned || 0;
    
    // Update levels
    if (user.points > 1000) user.level = 'Awareness Champion';
    else if (user.points > 500) user.level = 'Influencer';
    else if (user.points > 250) user.level = 'Contributor';
    else if (user.points > 100) user.level = 'Learner';
    
    await user.save();

    const log = await ActionLog.create({
      userId: req.user._id,
      actionType,
      category,
      description,
      pointsEarned,
      socialImpactMetrics: socialImpactMetrics || { treesPlanted: 0, plasticRecycledKg: 0, volunteerHours: 0, screenTimeReducedMins: 0 }
    });

    res.status(201).json({ log, newPoints: user.points, newLevel: user.level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
