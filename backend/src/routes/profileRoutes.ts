import { Role } from '@prisma/client';
import { Router } from 'express';
import {
  getClientProfile,
  getMusicianProfile,
  getProfile,
  updateClientProfile,
  updateMusicianProfile,
  updateProfile
} from '../controllers/profileController';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const profileRouter = Router();

profileRouter.get('/profile', authenticate, asyncHandler(getProfile));
profileRouter.put('/profile', authenticate, asyncHandler(updateProfile));

profileRouter.get('/client/profile', authenticate, requireRole(Role.CLIENT), asyncHandler(getClientProfile));
profileRouter.put('/client/profile', authenticate, requireRole(Role.CLIENT), asyncHandler(updateClientProfile));

profileRouter.get('/musician/profile', authenticate, requireRole(Role.MUSICIAN), asyncHandler(getMusicianProfile));
profileRouter.put('/musician/profile', authenticate, requireRole(Role.MUSICIAN), asyncHandler(updateMusicianProfile));
