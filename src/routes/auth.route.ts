import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers';
import { authMiddleware } from '../middlewares';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getCurrentUser);

export {authRouter};