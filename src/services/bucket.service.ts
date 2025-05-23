import mongoose from 'mongoose';
import { Bucket, StorageObject } from '../models';
import { BucketRepository, StorageObjectRepository } from '../repositories';
import { DTOCreateBucketData } from '../dtos';
import { BucketAccessLevel, IBucket } from '../interface';
import {BadRequestError} from '../errors';

class BucketService {
    private bucketRepository: BucketRepository;
    private storageObjectRepository: StorageObjectRepository;

    constructor() {
        this.bucketRepository = new BucketRepository(Bucket);
        this.storageObjectRepository = new StorageObjectRepository(StorageObject);
    }

    public async createBucket(data: DTOCreateBucketData): Promise<IBucket> {
        try{
            this.ensureValidObjectId(data.userId);

            const existing = await this.bucketRepository.findBucketWithNameAndUserInfo(data.name, data.userId);
            if(existing) throw new Error('BUCKET_ERROR1');

            const bucket = await this.bucketRepository.createBucket(data);
            return bucket;
        }catch(err){
            throw err;
        }
    }

    public async getAllBucketsUserHasAccessTo(userId: string): Promise<{ buckets: IBucket[]; sharedBuckets: IBucket[] }> {
        try{
            this.ensureValidObjectId(userId);

            const buckets = await this.bucketRepository.findAllBucketsOwnerByUser(userId);
            const sharedBuckets = await this.bucketRepository.findAllBucketsSharedWithUser(userId);

            return { buckets, sharedBuckets };
        }catch(err){
            throw err;
        }
    }

    public async getBucketById(userId: string, bucketId: string): Promise<{
        bucket: IBucket;
        totalSize: number;
        objectCount: number;
        isOwner: boolean;
    }> {
        try{
            this.ensureValidObjectId(bucketId);
            this.ensureValidObjectId(userId);

            const bucket = await this.bucketRepository.findBucketById(bucketId);
            if(!bucket) throw new Error('BUCKET_ERROR3');

            const isOwner = this.isOwner(bucket, userId);
            const isShared = this.isShared(bucket, userId);
            const isPublic = bucket.accessLevel === BucketAccessLevel.PUBLIC;

            if(!isOwner && !isShared && !isPublic) throw new Error('BUCKET_ERROR4');

            const [objectCount, totalSizeAgg] = await Promise.all([
                this.storageObjectRepository.getCountOfAllObjectsInBucket(bucketId),
                this.storageObjectRepository.getTotalStorageUsedInBucket(bucketId),
            ]);

            const totalSize = totalSizeAgg.length > 0 ? totalSizeAgg[0].total : 0;

            return { bucket, totalSize, objectCount, isOwner };
        }catch(err){
            throw err;
        }
    }

    public async shareBucketWithUser(bucketId: string, userIds: string[], ownerId: string): Promise<IBucket> {
        this.ensureValidObjectId(bucketId);

        const bucket = await this.bucketRepository.findBucketById(bucketId);
        if (!bucket) throw new Error('BUCKET_ERROR3');
        if (!this.isOwner(bucket, ownerId)) throw new Error('BUCKET_ERROR_NO_PERMISSION');

        bucket.accessLevel = BucketAccessLevel.SHARED;
        bucket.sharedWith ??= [];

        for (const id of userIds) {
            if (mongoose.Types.ObjectId.isValid(id) && !bucket.sharedWith.some(existingId => existingId.toString() === id)) {
                bucket.sharedWith.push(id as any);
            }
        }

        await bucket.save();
        return bucket;
    }

    public async revokeBucketAccessFromUser(bucketId: string, userIdToRevoke: string, ownerId: string): Promise<IBucket> {
        
        this.ensureValidObjectId(bucketId);

        const bucket = await this.bucketRepository.findBucketById(bucketId);
        if (!bucket) throw new Error('BUCKET_ERROR3');
        if (!this.isOwner(bucket, ownerId)) throw new Error('BUCKET_ERROR_NO_PERMISSION');

        // removing the user from shared array
        if(bucket.sharedWith && bucket.sharedWith.length > 0){
            bucket.sharedWith = bucket.sharedWith.filter(
                id => id.toString() !== userIdToRevoke
            ) as any[];
        }

        if(bucket.sharedWith.length === 0){
            bucket.accessLevel = BucketAccessLevel.PRIVATE;
        }

        await bucket.save();
        return bucket;
    }

    private isOwner(bucket: IBucket, userId: string): boolean {
        return bucket.owner.toString() === userId.toString();
    }

    private isShared(bucket: IBucket, userId: string): boolean {
        return bucket.accessLevel === BucketAccessLevel.SHARED &&
            bucket.sharedWith?.some(id => id.toString() === userId.toString());
    }

    private ensureValidObjectId(id: string): void {
        if (!mongoose.Types.ObjectId.isValid(id)){
            throw new BadRequestError('Invalid onject type');
        }
    }
}

export const bucketService = new BucketService();
