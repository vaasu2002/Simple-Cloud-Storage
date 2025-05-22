import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const configs = {
  port: process.env.PORT || 5000,
  
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/scs2',
  
  jwt:{
    secret: process.env.JWT_SECRET || 'vaasu2002',
    expiresIn: process.env.JWT_EXPIRY || '1d', 
  },
  
  storage:{
    path: process.env.STORAGE_PATH || path.join(__dirname, '../../storage'),
    tempPath: process.env.TEMP_STORAGE_PATH || path.join(__dirname, '../../temp'),
    maxSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 100 * 1024 * 1024, // 100MB default
  },
  
  logging:{
    level: process.env.LOG_LEVEL || 'info',
  }
};