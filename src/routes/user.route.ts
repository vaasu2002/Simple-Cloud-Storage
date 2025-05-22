import { Router } from 'express';
import { authMiddleware } from '../middlewares';

const userRouter = Router();

userRouter.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: (req as any).user,
    },
  });
});

export {userRouter};