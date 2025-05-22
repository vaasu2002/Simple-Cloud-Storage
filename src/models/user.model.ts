import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../interface';

const UserSchema = new Schema<IUserDocument>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    },{ timestamps: true }
);

// hash password before saving
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password'))return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// compare password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);