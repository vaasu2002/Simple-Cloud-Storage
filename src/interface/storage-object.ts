import { BucketAccessLevel, IBucket } from './bucket';
import { IObjectVersion } from './object-version';
import { IUser } from './user';

export interface IStorageObject {
    _id?: string;
    key: string; // virtual path (what user sees)
    storageKey: string; // physical storage path (where on disk file is stored)
    bucket: string | IBucket; // conceptual grouping (the bucket this object belongs)
    originalname: string; // file name provided by user
    filename: string;
    encoding: string;
    mimetype: string; // multipurpose internet mail extensions(to identify type of file)
    size: number; // file size in bytes
    owner: string | IUser;
    versions?: IObjectVersion[]; // array of all versions of file
    accessLevel: BucketAccessLevel; // inherited from bucket but can be overridden
    metadata?: Record<string, any>;
    tags?: string[];
    contentHash?: string; // For deduplication
    createdAt?: Date;
    updatedAt?: Date;
}