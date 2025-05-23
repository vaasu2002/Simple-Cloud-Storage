import { Bucket, StorageObject } from '../models';
import { BucketRepository, StorageObjectRepository } from '../repositories';
import { 
    DTOCreateBucketData
} from '../dtos';
import mongoose from 'mongoose';
import { BucketAccessLevel, IBucket } from '../interface';

class BucketService{
    private bucketRepository:BucketRepository;
    private storageObjectRepository:StorageObjectRepository;
    public constructor(){
        this.bucketRepository = new BucketRepository(Bucket);
        this.storageObjectRepository = new StorageObjectRepository(StorageObject);
    }
    public async createBucket(
        createBucketData:DTOCreateBucketData):Promise<any>{
        try{
            const existingBucket = await this.bucketRepository
                .findBucketWithNameAndUserInfo(
                    createBucketData.name,
                    createBucketData.userId
            );
            if(existingBucket){
                throw new Error('BUCKET_ERROR1')
            }
            const bucket = await this.bucketRepository.createBucket(
                createBucketData
            );
            return bucket;
        }catch(err){
            console.error('Error at bucket service(createBucket): ', err);
            throw err;
        } 
    }

    public async getAllBucketsUserHasAccessTo(userId:string):Promise<any>{
        try{
            const buckets = await this.bucketRepository.findAllBucketsOwnerByUser(userId);
            const sharedBuckets = await this.bucketRepository.findAllBucketsSharedWithUser(userId);
            return {buckets,sharedBuckets};
        }catch(err){
            console.error('Error at bucket service(getAllBucketsUserHasAccessTo): ', err);
            throw err;
        } 
    }

    public async getBucketById(userId:string,bucketId:string){        
        try{
            if(!mongoose.Types.ObjectId.isValid(bucketId)){
                throw new Error('BUCKET_ERROR2');
            };
            const bucket = await this.bucketRepository.findBucketById(bucketId);
            if(!bucket){
                throw new Error('BUCKET_ERROR3');
            }
        
            const isOwner = bucket.owner.toString() === userId.toString();
            
            const isShared = 
                    bucket.accessLevel === BucketAccessLevel.SHARED && 
                    bucket.sharedWith?.some(id => id.toString() === userId.toString());

            const isPublic = bucket.accessLevel === BucketAccessLevel.PUBLIC;

        
            if(!isOwner && !isShared && !isPublic){
                throw new Error('BUCKET_ERROR4');
            }
        
            const objectCount = await this.storageObjectRepository.getCountOfAllObjectsInBucket(bucketId)
        
            // Calculate total storage used in this bucket
            const storageUsed = await this.storageObjectRepository.getTotalStorageUsedInBucket(bucketId);
        
            const totalSize = storageUsed.length > 0 ? storageUsed[0].total : 0;
            return {bucket,totalSize,objectCount,isOwner};
        }catch(err){
            console.error('Error at bucket service(getBucketById): ', err);
        }
    }

    public async shareBucketWithUser(bucketId:string,userIds:string[],userId:string){
        try{
            if(!this.validateBucketId(bucketId)){
                throw new Error('BUCKET_ERROR2');
            };
            const bucket = await this.bucketRepository.findBucketById(bucketId);
            if(!bucket){
                throw new Error('BUCKET_ERROR3');
            }
            if(bucket.owner.toString() !== userId.toString()){
                throw new Error('You do not have permission to share this bucket');
            }

            // updating bucket access level to SHARED if it's not already
            bucket.accessLevel = BucketAccessLevel.SHARED;

            // adding users to the sharedWith array (avoiding duplicates)
            if(!bucket.sharedWith){
                bucket.sharedWith = [];
            }
            userIds.forEach((id: string) => {
                if(mongoose.Types.ObjectId.isValid(id) && 
                !bucket.sharedWith?.some(existingId => existingId.toString() === id)){
                    bucket.sharedWith?.push(id as any);
                }
            });
            await bucket.save();
            return bucket;
        }catch(err){
            throw err;
        }
    }
    public async revokeBucketAccessFromUser(bucketId:string,userIdToRevoke:string,userId:string){
        try{
            if(!this.validateBucketId(bucketId)){
                throw new Error('BUCKET_ERROR2');
            };
            const bucket = await this.bucketRepository.findBucketById(bucketId);
            if(!bucket){
                throw new Error('BUCKET_ERROR3');
            }
            if(!this.isOwner(bucket,userId)){
                throw new Error('You do not have permission to revoke access to this bucket');
            }
            // removing the user from shared array
            if(bucket.sharedWith && bucket.sharedWith.length > 0){
                bucket.sharedWith = bucket.sharedWith.filter(
                    id => id.toString() !== userIdToRevoke
                ) as any[];
            }

            if(!bucket.sharedWith || bucket.sharedWith.length === 0){
                bucket.accessLevel = BucketAccessLevel.PRIVATE;
            }
            await bucket.save();
            return bucket;
        }catch(err){
            throw err;
        }

    }
    private isOwner(bucket:IBucket,userId):boolean{
        return bucket.owner.toString() === userId.toString();
    }
    private validateBucketId(bucketId:string):boolean{
        return mongoose.Types.ObjectId.isValid(bucketId);
    }
}

export const bucketService = new BucketService();