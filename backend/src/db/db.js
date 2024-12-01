import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { DB_NAME } from '../utils/constants.js';

dotenv.config();

export const connectDB = async () => {
  try {
    const connectionString = `${process.env.MONGODB_URI}/${DB_NAME}`;
    
    await mongoose.connect(connectionString);

    console.log(`MongoDB connected successfully to host: ${connectionString}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

export default mongoose.connection;