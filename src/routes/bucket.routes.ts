import { Router } from 'express';
import {
    createBucket,
} from '../controllers';
import { authMiddleware } from '../middlewares';

const bucketRouter = Router();

bucketRouter.use(authMiddleware);

bucketRouter.post('/', createBucket);

export {bucketRouter};