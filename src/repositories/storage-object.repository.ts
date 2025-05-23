import mongoose, { Model } from 'mongoose';
import { BucketAccessLevel, IStorageObject } from '../interface';
import { DTOCreateBucketData } from '../dtos';

export class StorageObjectRepository{
    private model:Model<IStorageObject>;
    public constructor(model:Model<IStorageObject>){
        this.model = model;
    }

    async getCountOfAllObjectsInBucket(bucketId:string){
        try{
            const count = await this.model.countDocuments({ bucket: bucketId });
            return count;
        }catch(err){
            throw err;
        }
    }

    async getTotalStorageUsedInBucket(bucketId:string){
        try{
            const storageUsed = await this.model.aggregate([
                { 
                    $match: { 
                        bucket: new mongoose.Types.ObjectId(bucketId) 
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