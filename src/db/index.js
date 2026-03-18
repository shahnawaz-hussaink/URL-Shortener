import mongoose from 'mongoose';
import { DB_NAME } from '../contants.js';

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.log('MongoDB Connection Failed! ');
  }
};

export default dbConnect;
