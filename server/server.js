import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import challengeRoutes from './routes/challenges.js';
import actionRoutes from './routes/actions.js';
import aiRoutes from './routes/ai.js';
import reelRoutes from './routes/reels.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*' // Allow all for demo environment
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reels', reelRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('AwareSphere API is running successfully...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
