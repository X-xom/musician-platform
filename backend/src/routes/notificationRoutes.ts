import { Router } from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const notificationRouter = Router();

notificationRouter.get('/', authenticate, asyncHandler(getNotifications));
notificationRouter.put('/:id/read', authenticate, asyncHandler(markNotificationAsRead));
