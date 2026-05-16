import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

const clientProfileSchema = z.object({
  login: z.string().min(3).optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});

const musicianProfileSchema = z.object({
  bio: z.string().optional(),
  genre: z.string().optional(),
  instrument: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  portfolioUrl: z
    .string()
    .url("Некорректная ссылка")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
});

function requireCurrentUser(req: Request) {
  if (!req.user) {
    throw new HttpError(401, "Требуется авторизация");
  }

  return req.user;
}

export async function getProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      login: true,
      phone: true,
      role: true,
      createdAt: true,
      client: true,
      musician: true,
    },
  });

  if (!user) {
    throw new HttpError(404, "Пользователь не найден");
  }

  res.json(user);
}

export async function updateProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);

  if (currentUser.role === Role.CLIENT) {
    return updateClientProfile(req, res);
  }

  return updateMusicianProfile(req, res);
}

export async function getClientProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);

  const profile = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      login: true,
      phone: true,
      role: true,
      client: true,
    },
  });

  if (!profile?.client) {
    throw new HttpError(404, "Профиль заказчика не найден");
  }

  res.json(profile);
}

export async function updateClientProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);
  const data = clientProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      login: data.login,
      phone: data.phone,
      client: {
        update: {
          companyName: data.companyName,
        },
      },
    },
    select: {
      id: true,
      login: true,
      phone: true,
      role: true,
      client: true,
    },
  });

  res.json(user);
}

export async function getMusicianProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);

  const profile = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      login: true,
      phone: true,
      role: true,
      musician: true,
    },
  });

  if (!profile?.musician) {
    throw new HttpError(404, "Профиль музыканта не найден");
  }

  res.json(profile);
}

export async function updateMusicianProfile(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);
  const data = musicianProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      phone: data.phone,
      musician: {
        update: {
          bio: data.bio,
          genre: data.genre,
          instrument: data.instrument,
          experience: data.experience,
          education: data.education,
          portfolioUrl: data.portfolioUrl || undefined,
        },
      },
    },
    select: {
      id: true,
      login: true,
      phone: true,
      role: true,
      musician: true,
    },
  });

  res.json(user);
}
