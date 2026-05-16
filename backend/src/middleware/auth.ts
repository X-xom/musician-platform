import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { HttpError } from '../utils/httpError';

interface JwtPayload {
  id: number;
  login: string;
  role: Role;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Требуется авторизация'));
  }

  const token = header.slice('Bearer '.length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new HttpError(500, 'JWT_SECRET не настроен'));
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: payload.id,
      login: payload.login,
      role: payload.role
    };
    return next();
  } catch {
    return next(new HttpError(401, 'Недействительный или истекший токен'));
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, 'Требуется авторизация'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Недостаточно прав'));
    }

    return next();
  };
}
