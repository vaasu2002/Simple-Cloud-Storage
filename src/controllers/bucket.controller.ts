import { Response ,Request} from 'express';
import { Bucket } from '../models/bucket.model';
import { StorageObject } from '../models';
import { IAuthRequest, BucketAccessLevel } from '../interface';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import {configs} from '../config';
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
    console.error('Get all buckets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve buckets',
      error: (error as Error).message,
    });
  }
};

// // Get a single bucket by ID
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
  } catch (error) {
    console.error('Get bucket by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve bucket',
      error: (error as Error).message,
    });
  }
};

// // Share a bucket with other users
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