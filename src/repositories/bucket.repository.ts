import { Model } from 'mongoose';
import { BucketAccessLevel, IBucket } from '../interface';
import { DTOCreateBucketData } from '../dtos';

export class BucketRepository{
    private model:Model<IBucket>;
    public constructor(model:Model<IBucket>){
        this.model = model;
    }

    async findBucketWithNameAndUserInfo(bucketName:string,userId:string){
        try{
            const bucket = await this.model.findOne(
                { 
                    name:bucketName, 
                    owner: userId 
                }
            );
            return bucket;
        }catch(err){
            throw err;
        }
    }

    async findAllBucketsSharedWithUser(userId:string){
        try{
            const buckets = await this.model.find(
                { 
                    accessLevel:BucketAccessLevel.SHARED,
                    sharedWith: { 
                        $in: [userId] 
                    }
                }
            ).populate('owner', 'username email');
            return buckets;
        }catch(err){
            throw err;
        }
    }
    
    async findAllBucketsOwnerByUser(userId:string){
        try{
            const buckets = await this.model.find(
                { 
                    owner: userId 
                }
            );
            return buckets;
        }catch(err){
            throw err;
        }
    }

    async createBucket(data:DTOCreateBucketData){
        try{
            const bucket = await this.model.create({
                name:data.name,
                owner:data.userId,
                accessLevel:data.accessLevel || BucketAccessLevel.PRIVATE
            });
            return bucket;
        }catch(err){
            throw err;
        }
    }

    async findBucketById(bucketId:string){
        try{
            const bucket = await this.model.findById(bucketId);
            return bucket;
        }catch(err){
            throw err;
        }
    }

}