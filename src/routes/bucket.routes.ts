import { Router } from 'express';
import {
    createBucket,
    getAllBucketsUserHasAccessTo,
    getBucketById,
    shareBucket,
} from '../controllers';
import { authMiddleware } from '../middlewares';

const bucketRouter = Router();

bucketRouter.use(authMiddleware);

bucketRouter.post('/', createBucket);
bucketRouter.get('/', getAllBucketsUserHasAccessTo);
bucketRouter.get('/:bucketId', getBucketById);
bucketRouter.post('/:bucketId/share', shareBucket);

export {bucketRouter};