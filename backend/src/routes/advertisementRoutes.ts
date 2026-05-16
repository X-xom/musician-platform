import { Role } from '@prisma/client';
import { Router } from 'express';
import {
  createAdvertisement,
  createResponse,
  deleteAdvertisement,
  getAdvertisementById,
  getAdvertisementResponses,
  getAdvertisements,
  getMyAdvertisements,
  updateAdvertisement
} from '../controllers/advertisementController';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const advertisementRouter = Router();

advertisementRouter.get('/', authenticate, asyncHandler(getAdvertisements));
advertisementRouter.get('/my', authenticate, requireRole(Role.CLIENT), asyncHandler(getMyAdvertisements));
advertisementRouter.post('/', authenticate, requireRole(Role.CLIENT), asyncHandler(createAdvertisement));
advertisementRouter.get('/:id', authenticate, asyncHandler(getAdvertisementById));
advertisementRouter.put('/:id', authenticate, requireRole(Role.CLIENT), asyncHandler(updateAdvertisement));
advertisementRouter.delete('/:id', authenticate, requireRole(Role.CLIENT), asyncHandler(deleteAdvertisement));
advertisementRouter.post('/:id/response', authenticate, requireRole(Role.MUSICIAN), asyncHandler(createResponse));
advertisementRouter.get('/:id/responses', authenticate, requireRole(Role.CLIENT), asyncHandler(getAdvertisementResponses));
