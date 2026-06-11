import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ['citizen', 'ngo', 'admin'], default: 'citizen' },
  ageGroup: { type: String, enum: ['child', 'teen', 'adult', 'senior'], default: 'adult' },
  avatar: { type: String, default: 'default_avatar.png' },
  points: { type: Number, default: 0 },
  level: { type: String, enum: ['Explorer', 'Learner', 'Contributor', 'Influencer', 'Awareness Champion'], default: 'Explorer' },
  badges: [{
    name: String,
    icon: String,
    awardedAt: { type: Date, default: Date.now }
  }],
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date },
  digitalDetox: {
    screenTimeGoal: { type: Number, default: 120 }, // in minutes
    screenTimeLogs: [{
      date: { type: String }, // YYYY-MM-DD
      duration: { type: Number } // in minutes
    }]
  },
  familyId: { type: String }, // Simple tracking of family link
  schoolId: { type: String }, // For leaderboard rankings
  interests: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);
export default User;
