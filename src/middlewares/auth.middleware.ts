import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import {configs} from '../config';
import { IAuthRequest } from '../interface';

export const authMiddleware = async (
    req: IAuthRequest,        
    res: Response,
    next: NextFunction) =>{

    try {
        // extracting token from Authorization header "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const authHeader = (req.headers as any).authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                status: 'error',
                message: 'Authentication failed: No token provided',
            });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, configs.jwt.secret) as { id: string };
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                status: 'error',
                message: 'Authentication failed: User not found'
            });
        }
        req.user = user;
        next();
    }catch(error){
        console.error('Authentication error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Authentication failed: Invalid token',
        });
    }
};