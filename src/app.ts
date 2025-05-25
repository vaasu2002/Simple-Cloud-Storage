import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './config';
import { healthRoute,userRouter,authRouter,bucketRouter,storageRouter } from './routes';

export class App{
  public app:Express;

  constructor(){
      this.app = express();
      this.setupMiddleware();
      this.setupRoutes();
  }

  private setupMiddleware(): void{
      this.app.use(helmet());
      this.app.use(cors('*'));
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
  
      this.app.use(morgan('combined',{
              stream:{
                  write: (message: string) =>{
                      logger.info(message.trim());
                  }
              }
      }));
  }
  private setupRoutes(): void{
    this.app.use('/health',healthRoute);
    this.app.use('/auth',authRouter);
    this.app.use('/buckets',bucketRouter);
    this.app.use('/storage',storageRouter);
    this.app.use('/user',userRouter);
  }
}

export const app = new App().app;