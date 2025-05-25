import express, {Express, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { generateSnowflakeId } from '../utils';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}

export const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = generateSnowflakeId()+'temp_upload'
    cb(null, uniqueSuffix+file.originalname);
  },
  
});

export const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });