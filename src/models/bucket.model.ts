import mongoose, { Schema } from 'mongoose';
import { BucketAccessLevel, IBucket } from '../interface';

const BucketSchema = new Schema<IBucket>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    accessLevel:{
        type: String,
        enum: Object.values(BucketAccessLevel),
        default: BucketAccessLevel.PRIVATE,
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    },
    { timestamps: true }
);

// Ensure bucket names are unique per user
BucketSchema.index({ name: 1, owner: 1 }, { unique: true });

export const Bucket = mongoose.model<IBucket>('Bucket', BucketSchema);