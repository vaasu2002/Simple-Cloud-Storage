import jwt from 'jsonwebtoken';
import {configs} from '../config';
import { IUserDocument } from '../interface';

export const generateToken = (user: IUserDocument): string => {
    return jwt.sign(
        { 
            id: user._id 
        },
        configs.jwt.secret,
        { 
            expiresIn: configs.jwt.expiresIn 
        }
    );
};