import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockUsers } from '../config/mockStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'awarespheresupersecrettoken', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, ageGroup, interests, schoolId } = req.body;

  try {
    // Offline Mock Fallback
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Registering mock user.");
      const userExists = mockUsers.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const mockUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password: password || 'password', // Store simple password
        role: role || 'citizen',
        ageGroup: ageGroup || 'adult',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        points: 0,
        level: 'Explorer',
        badges: [],
        streak: 1,
        digitalDetox: {
          screenTimeGoal: 120,
          screenTimeLogs: []
        },
        familyId: '',
        schoolId: schoolId || '',
        interests: interests || [],
        lastActiveDate: new Date(),
        save: async function() { return this; }
      };

      mockUsers.push(mockUser);

      return res.status(201).json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        ageGroup: mockUser.ageGroup,
        points: mockUser.points,
        level: mockUser.level,
        streak: mockUser.streak,
        token: generateToken(mockUser._id),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'citizen',
      ageGroup: ageGroup || 'adult',
      interests: interests || [],
      schoolId: schoolId || '',
      lastActiveDate: new Date()
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ageGroup: user.ageGroup,
        points: user.points,
        level: user.level,
        streak: user.streak,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Offline Mock Fallback
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Authenticating mock user.");
      const user = mockUsers.find(u => u.email === email);
      
      // Allow demo login with standard matching or any password in offline mode
      if (user) {
        user.lastActiveDate = new Date();
        user.streak = (user.streak || 0) + 1;
        
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          ageGroup: user.ageGroup,
          points: user.points,
          level: user.level,
          streak: user.streak,
          badges: user.badges,
          digitalDetox: user.digitalDetox,
          interests: user.interests,
          familyId: user.familyId,
          schoolId: user.schoolId,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Manage daily streak
      const today = new Date().toDateString();
      const lastActive = user.lastActiveDate ? user.lastActiveDate.toDateString() : null;
      
      let updatedStreak = user.streak;
      if (lastActive) {
        const diffTime = Math.abs(new Date(today) - new Date(lastActive));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          updatedStreak += 1;
        } else if (diffDays > 1) {
          updatedStreak = 1;
        }
      } else {
        updatedStreak = 1;
      }
      
      user.streak = updatedStreak;
      user.lastActiveDate = new Date();
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ageGroup: user.ageGroup,
        points: user.points,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        digitalDetox: user.digitalDetox,
        interests: user.interests,
        familyId: user.familyId,
        schoolId: user.schoolId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Sign In Simulation
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { email, name, googleId, avatar } = req.body;

  try {
    // Offline Mock Fallback
    if (mongoose.connection.readyState !== 1) {
      console.warn("DB not connected. Google login mock user.");
      let user = mockUsers.find(u => u.email === email);

      if (!user) {
        user = {
          _id: 'user_' + Date.now(),
          name,
          email,
          googleId,
          avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          role: 'citizen',
          ageGroup: 'adult',
          points: 0,
          level: 'Explorer',
          badges: [],
          streak: 1,
          digitalDetox: { screenTimeGoal: 120, screenTimeLogs: [] },
          familyId: '',
          schoolId: '',
          interests: [],
          lastActiveDate: new Date(),
          save: async function() { return this; }
        };
        mockUsers.push(user);
      } else {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        user.lastActiveDate = new Date();
      }

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ageGroup: user.ageGroup,
        points: user.points,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        token: generateToken(user._id),
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: avatar || 'default_avatar.png',
        role: 'citizen',
        ageGroup: 'adult',
        lastActiveDate: new Date(),
        streak: 1
      });
    } else {
      user.googleId = googleId;
      if (avatar) user.avatar = avatar;
      user.lastActiveDate = new Date();
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ageGroup: user.ageGroup,
      points: user.points,
      level: user.level,
      streak: user.streak,
      badges: user.badges,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // Offline Mock Fallback
    if (mongoose.connection.readyState !== 1) {
      if (req.user) {
        return res.json({
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          ageGroup: req.user.ageGroup,
          points: req.user.points,
          level: req.user.level,
          streak: req.user.streak,
          badges: req.user.badges,
          digitalDetox: req.user.digitalDetox,
          interests: req.user.interests,
          familyId: req.user.familyId,
          schoolId: req.user.schoolId
        });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ageGroup: user.ageGroup,
        points: user.points,
        level: user.level,
        streak: user.streak,
        badges: user.badges,
        digitalDetox: user.digitalDetox,
        interests: user.interests,
        familyId: user.familyId,
        schoolId: user.schoolId
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
