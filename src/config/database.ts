import mongoose from 'mongoose';
import {configs} from './config'
import { logger } from './logger';

export class Database {
    private static instance: Database;
    private isConnected = false;
    private uri: string;

    private constructor(){
        this.uri = configs.mongoUri;
        if(!this.uri){
            logger.error('MONGODB_URI is not set in environment variables');
            process.exit(1);
        }

        mongoose.set('strictQuery', false);
    }

    // Singleton Pattern - ensuring single instance
    public static getInstance(): Database {
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void>{
        if(this.isConnected){
            logger.info('MongoDB is already connected');
            return;
        }

        try{
            await mongoose.connect(this.uri);
            this.isConnected = true;
            logger.info('MongoDB connected successfully');
        }catch(error){
            logger.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }

    public async disconnect(): Promise<void>{
        if(!this.isConnected){
            return;
        }
        try{
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('MongoDB disconnected successfully');
        }catch(error){
            logger.error('MongoDB disconnection error:', error);
        }
    }
}

export const database = Database.getInstance();