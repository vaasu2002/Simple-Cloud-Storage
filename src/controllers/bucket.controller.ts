import { Response ,Request} from 'express';

import { bucketService } from '../services/bucket.service';

export const createBucket = async (req: Request, res: Response) => {
  try{
    const {name, accessLevel } = req.body;
    const userId = req.user?._id;
    if(!userId){
      return res.status(401).json({
        status: 'error',
        message: 'Failed to create bucket',
        data:{
          error: 'Unauthorized: User not authenticated',
        }
      });
    }   
    const bucket = await bucketService.createBucket({name,userId,accessLevel});
    res.status(201).json({
      status: 'success',
      message: 'Bucket created successfully',
      data: {
        bucket: {
          id: bucket._id,
          name: bucket.name,
          accessLevel: bucket.accessLevel,
          createdAt: bucket.createdAt,
        },
      },
    });
  }catch(error){
    console.error('Create bucket error:', error);
    if(error.message==='BUCKET_ERROR1'){
      res.status(409).json({
        status: 'error',
        message: 'Failed to create bucket',
        data:{
          error: 'Bucket with name already exists with user',
        }
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Failed to create bucket',
      data:{
        error: 'Internal Server Error',
      }
    });
  }
};
