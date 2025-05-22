import { Bucket } from '../models';
import { BucketRepository } from '../repositories';
import { 
    DTOCreateBucketData
} from '../dtos';

class BucketService{
    private bucketRepository:BucketRepository;
    public constructor(){
        this.bucketRepository = new BucketRepository(Bucket)
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
            console.error('Registration error:', err);
            throw err;
        } 
    }
}

export const bucketService = new BucketService();