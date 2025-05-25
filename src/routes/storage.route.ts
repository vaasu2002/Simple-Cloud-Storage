import { Router } from 'express';
import {
    uploadFile,
} from '../controllers/object.storage.controller';
import { authMiddleware } from '../middlewares';
import {upload} from '../config';

const storageRouter = Router();

storageRouter.use(authMiddleware);

storageRouter.post('/bucket/:bucketId/upload',upload.single('file'), uploadFile);

export {storageRouter};