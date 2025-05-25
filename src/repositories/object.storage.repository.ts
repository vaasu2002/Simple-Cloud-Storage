import mongoose, { Model } from 'mongoose';
import { 
    BucketAccessLevel, 
    IObjectVersion, 
    IStorageObject 
} from '../interface';
import { DTOCreateBucketData, DTOuploadFile,CreateObjectDtoRepo } from '../dtos';

export class ObjectStorageRepository{
    private model:Model<IStorageObject>;
    public constructor(model:Model<IStorageObject>){
        this.model = model;
    }

    async getObjectByContentHash(contentHash:string){
        try{
            const object = await this.model.findOne({
                contentHash:contentHash
            });
            return object;
        }catch(err:any){
            throw err;
        }
    }

    async updateObjectVersion(objectId:string,version:IObjectVersion){
        try{
            const updatedObject = await this.model.findOneAndUpdate(
                { _id: objectId },
                { $push: { versions: version } },
                // returns the updated document
                { new: true }
            );
            return updatedObject;
        }catch(err:any){
            throw err;
        }
    }

    async getCountOfAllObjectsInBucket(bucketId:string){
        try{
            const count = await this.model.countDocuments({ 
                bucket: bucketId 
            });
            return count;
        }catch(err){
            throw err;
        }
    }

    async getObjectByLogicalKeyAndBucket(
            bucketId:string,logicalKey:string){
        try{
            const existingObject = await this.model.findOne({ 
                bucket: bucketId, 
                key: logicalKey 
            });
            return existingObject;
        }catch(err:any){
            throw err;
        }
    }

    async createObject(data:CreateObjectDtoRepo){
        try{
            const object = await this.model.create(data);
            return object;
        }catch(err:any){
            throw err;
        }
    }

    async getTotalStorageUsedInBucket(bucketId:string){
        try{
            const storageUsed = await this.model.aggregate([
                {   $match: { 
                        bucket: new mongoose.Types
                        .ObjectId(bucketId) 
                    } 
                },
                { 
                    $group: { 
                        _id: null, 
                        total: { 
                            $sum: '$size' 
                        } 
                    } 
                },
            ]);
            return storageUsed;
        }catch(err){
            throw err;
        }
    }
}