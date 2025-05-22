import { IUser } from './user';

export enum BucketAccessLevel {
    PRIVATE = 'private',
    PUBLIC = 'public',
    SHARED = 'shared'
}

export interface IBucket {
    _id?: string;
    name: string;
    owner: string | IUser;
    accessLevel: BucketAccessLevel;
    sharedWith?: string[] | IUser[];
    createdAt?: Date;
    updatedAt?: Date;
}