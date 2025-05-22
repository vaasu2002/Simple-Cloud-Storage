import { Request, Response } from 'express';
import {authService} from '../services'

export const register = async (req: Request, res: Response) => {
    try{
        const data = await authService.register(req.body);
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: data.user._id,
                    username: data.user.username,
                    email: data.user.email,
                },
                token:data.token
            },
        });
    }catch(error){
        console.error('Registration error:', error);
        if(error.message==='ERRCODE1'){
            res.status(409).json({
                status: 'error',
                message: 'Failed to register user',
                data:{
                    error: 'User with the given credentials already exists',
                }
            });
        }
        else if(error.message==='ERRCODE2'){
            res.status(400).json({
                status: 'error',
                message: 'Failed to register user',
                data:{
                    error: 'Fields needed are not available',
                }
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to register user',
            data:{
                error: 'Internal Server Error',
            }
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try{
        const data = await authService.login(req.body);
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: {
                user: {
                    id: data.user._id,
                    username: data.user.username,
                    email: data.user.email,
                },
                token:data.token
            },
        });
    }catch(error){
        if(error.message==='ERRCODE3'){
            res.status(404).json({
                status: 'error',
                message: 'Failed to login',
                data:{
                    error: 'User with the given credentials does not exist',
                }
            });
        }
        else if(error.message==='ERRCODE4'){
            res.status(401).json({
                status: 'error',
                message: 'Failed to login',
                data:{
                    error: 'Invalid credentails',
                }
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Failed to login',
            error: 'Internal Server Error',
        });
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try{
        const user = (req as any).user;
        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
        });
    }catch (error){
        console.error('Get current user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get current user',
            error: (error as Error).message,
        });
    }
};