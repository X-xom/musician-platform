import { Role } from '@prisma/client';
import { Router } from 'express';
import { getMyResponses, updateResponseStatus } from '../controllers/advertisementController';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const responseRouter = Router();

responseRouter.get('/my', authenticate, requireRole(Role.MUSICIAN), asyncHandler(getMyResponses));
responseRouter.put('/:id/status', authenticate, requireRole(Role.CLIENT), asyncHandler(updateResponseStatus));
