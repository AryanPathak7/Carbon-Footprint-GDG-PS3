import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
