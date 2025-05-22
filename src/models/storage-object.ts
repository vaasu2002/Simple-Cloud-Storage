import mongoose, { Schema } from 'mongoose';
import {
    IObjectVersion,
    BucketAccessLevel,
    IStorageObject
} from '../interface';

const ObjectVersionSchema = new Schema<IObjectVersion>({
    versionId: {
        type: String,
        required: true,
    },
    storageKey: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
});

const StorageObjectSchema = new Schema<IStorageObject>({
    // virtual path
    key:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    // conceptual grouping
    bucket: {
        type: Schema.Types.ObjectId,
        ref: 'Bucket',
        required: true,
        index: true,
    },
    originalname: {
        type: String,
        required: true,
    },
    // The unique storage key for the current version (physical location)
    storageKey: {
        type: String,
        required: true,
    },
    encoding: {
        type: String,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
        index: true,
    },
    size: {
        type: Number,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    versions: [ObjectVersionSchema],
    accessLevel: {
        type: String,
        enum: Object.values(BucketAccessLevel),
        default: BucketAccessLevel.PRIVATE,
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {},
    },
    tags: [{
        type: String,
        trim: true,
    }],
    // for indentifying deduplication
    contentHash: {
        type: String,
        index: true,
    },
    },{ 
        timestamps: true 
    }
);

// indexes:-

// for efficient lookup by owner and key prefix (for listing directories)
StorageObjectSchema.index({ owner: 1, key: 1 });
// efficient content hash lookup (detect deduplication)
StorageObjectSchema.index({ owner: 1, contentHash: 1 });
// search by tag
StorageObjectSchema.index({ tags: 1 });

export const StorageObject = mongoose.model('StorageObject', StorageObjectSchema);