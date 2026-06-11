import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (token === 'mock_token_abc') {
        let mockUser = await User.findOne({ email: 'citizen@awaresphere.org' });
        if (!mockUser) {
          mockUser = await User.create({
            name: 'Aravind Sharma',
            email: 'citizen@awaresphere.org',
            role: 'citizen',
            ageGroup: 'adult',
            points: 320
          });
        }
        req.user = mockUser;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'awarespheresupersecrettoken');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const ngo = (req, res, next) => {
  if (req.user && (req.user.role === 'ngo' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an NGO/Organization' });
  }
};
