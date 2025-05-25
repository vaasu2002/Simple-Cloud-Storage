import { Request, Response } from 'express';
import { StorageService } from '../services';


const storageService = new StorageService();

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { bucketId } = req.params;
    const { directory, tags, metadata } = req.body;
    const userId = req.user?._id;

    const data = await storageService.uploadObject({
      file: file, userId: userId, bucketId: bucketId,
      directory: directory, tags: tags, metadata: metadata
    });
    res.status(200).json({
      sucess: true,
      message: 'File uploaded successfully',
      error: '',
      data: data,
    })
  }catch(err){
    console.error('Error uploading file:', err);
    res.status(200).json({
      sucess: false,
      message: 'File upload failed',
      error: '',
      data: {},
    })
  }
}