import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
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

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP in demo to prevent blocking external map tiles or assets
  crossOriginEmbedderPolicy: false
}));

// Rate Limiting to prevent abuse on key endpoints (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Efficiency Middlewares (gzip compression)
app.use(compression());

// Middlewares
app.use(cors({
  origin: '*' // Allow all for demo environment
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Apply Rate Limiter to Auth and AI chatbot endpoints
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);

// Other Routes Mount
app.use('/api/campaigns', campaignRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/actions', actionRoutes);
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
