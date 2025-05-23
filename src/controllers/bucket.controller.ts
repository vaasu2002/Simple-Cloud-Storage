import { Response ,Request} from 'express';
import { bucketService } from '../services';
import {GenericApiError} from '../errors';

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
    const message = 'Failed to create bucket'
    if(error instanceof GenericApiError){
      res.status(error.statusCode).json({
        success: false,
        message: message,
        data:{
          error: error.errorExplanation,
        }
      });
    }
    res.status(500).json({
      success: false,
      message: message,
      data:{
        error: 'Internal Server Error',
      }
    });
  }
};

export const getAllBucketsUserHasAccessTo = async (req: Request, res: Response) =>{
  try{
    const userId = req.user?._id;
    if(!userId){
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User not authenticated'
      });
    }
    
    const {buckets,sharedBuckets} = await bucketService.getAllBucketsUserHasAccessTo(userId);
    res.status(200).json({
      status: 'success',
      data: {
        buckets: [
          ...buckets.map(bucket => ({
            id: bucket._id,
            name: bucket.name,
            accessLevel: bucket.accessLevel,
            createdAt: bucket.createdAt,
            isOwner: true,
          })),
          ...sharedBuckets.map(bucket => ({
            id: bucket._id,
            name: bucket.name,
            accessLevel: bucket.accessLevel,
            createdAt: bucket.createdAt,
            owner: {
              id: (bucket.owner as any)._id,
              username: (bucket.owner as any).username,
            },
            isOwner: false,
          })),
        ],
      },
    });
  }catch(error){
    const message = 'Failed to retrieve buckets'
    if(error instanceof GenericApiError){
      res.status(error.statusCode).json({
        success: false,
        message: message,
        data:{
          error: error.errorExplanation,
        }
      });
    }
    res.status(500).json({
      success: false,
      message: message,
      data:{
        error: 'Internal Server Error',
      }
    });
  }
};

export const getBucketById = async (req: Request, res: Response) => {
  try {
    const { bucketId } = req.params;
    const userId = req.user?._id;

    const {bucket,totalSize,objectCount,isOwner} = await bucketService.getBucketById(userId,bucketId);

    res.status(200).json({
      status: 'success',
      data: {
        bucket: {
          id: bucket._id,
          name: bucket.name,
          accessLevel: bucket.accessLevel,
          createdAt: bucket.createdAt,
          updatedAt: bucket.updatedAt,
          isOwner,
          stats: {
            objectCount,
            storageUsed: totalSize,
          },
        },
      },
    });
  }catch(error){
    const message = 'Failed to retrieve bucket'
    if(error instanceof GenericApiError){
      res.status(error.statusCode).json({
        success: false,
        message: message,
        data:{
          error: error.errorExplanation,
        }
      });
    }
    res.status(500).json({
      success: false,
      message: message,
      data:{
        error: 'Internal Server Error',
      }
    });
  }
};

export const shareBucket = async (req: Request, res: Response) => {
  try {
    const { bucketId } = req.params;
    const { userIds } = req.body;
    const ownerId = req.user?._id;

    const bucket = await bucketService.shareBucketWithUser(bucketId,userIds,ownerId);

    res.status(200).json({
      status: 'success',
      message: 'Bucket shared successfully',
      data: {
        bucket: {
          id: bucket._id,
          name: bucket.name,
          accessLevel: bucket.accessLevel,
          sharedWith: bucket.sharedWith,
        },
      },
    });
  }catch(error){
    console.error('Share bucket error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to share bucket',
      error: (error as Error).message,
    });
  }
};


// Revoke bucket access from users
export const revokeBucketAccess = async (req: Request, res: Response) => {
  try {
    const { bucketId } = req.params;
    const { userIdToRevoke } = req.body;
    const userId = req.user?._id;
    
    const bucket = await bucketService.revokeBucketAccessFromUser(bucketId,userIdToRevoke,userId);

    res.status(200).json({
      status: 'success',
      message: 'Access revoked successfully',
      data: {
        bucket: {
          id: bucket._id,
          name: bucket.name,
          accessLevel: bucket.accessLevel,
          sharedWith: bucket.sharedWith,
        },
      },
    });
  } catch (error) {
    console.error('Revoke bucket access error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to revoke access',
      error: (error as Error).message,
    });
  }
};