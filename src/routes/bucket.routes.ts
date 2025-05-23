import { Router } from 'express';
import {
    createBucket,
    getAllBucketsUserHasAccessTo,
    getBucketById,
    shareBucket,
    revokeBucketAccess,
} from '../controllers';
import { authMiddleware } from '../middlewares';

const bucketRouter = Router();

bucketRouter.use(authMiddleware);

bucketRouter.post('/', createBucket);
bucketRouter.get('/', getAllBucketsUserHasAccessTo);
bucketRouter.get('/:bucketId', getBucketById);
bucketRouter.post('/:bucketId/share', shareBucket);
bucketRouter.post('/:bucketId/revoke-access', revokeBucketAccess);

export {bucketRouter};