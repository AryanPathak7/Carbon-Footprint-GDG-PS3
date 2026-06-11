import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Disable command buffering so queries fail immediately instead of hanging
    mongoose.set('bufferCommands', false);

    const connectionString = process.env.MONGO_URI || 'mongodb://localhost:27017/awaresphere';
    console.log('Connecting to MongoDB...');
    
    const conn = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30 seconds
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend is running in OFFLINE/FALLBACK mode with in-memory mock storage.');
  }
};

export default connectDB;
