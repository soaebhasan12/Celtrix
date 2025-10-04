import mongoose from 'mongoose';
import { env } from '../constant/env.constant';

const connectDB = async () => {
  try {
    let conn = await mongoose.connect(env.DB_CONNECTION_STRING, {
      dbName: env.DB_NAME,
      autoIndex: env.NODE_ENV !== 'production',
    });
  } catch (error) {}
};
