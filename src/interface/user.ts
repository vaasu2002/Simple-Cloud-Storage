import { IStorageObject } from './storage-object';

export interface IUser {
    _id?: string;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<boolean>;
}

export interface IAuthRequest extends Request {
    user?: IUserDocument;
}

export interface IUsageStatistics {
    totalStorageUsed: number;
    fileCount: number;
    filesByType: Record<string, number>;
    averageFileSize: number;
    largestFiles: IStorageObject[];
    recentUploads: IStorageObject[];
    bucketStats: {
        bucketId: string;
        bucketName: string;
        storageUsed: number;
        fileCount: number;
    }[];
}