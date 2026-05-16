import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

const authSchema = z.object({
  login: z.string().min(3, "Логин должен содержать минимум 3 символа"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  role: z.nativeEnum(Role),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

function signToken(user: { id: number; login: string; role: Role }) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new HttpError(500, "JWT_SECRET не настроен");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "7d") as SignOptions["expiresIn"];

  return jwt.sign(user, secret, { expiresIn });
}

function getRedirectPath(role: Role) {
  return role === Role.CLIENT
    ? "/client/advertisements"
    : "/musician/advertisements";
}

export async function register(req: Request, res: Response) {
  const data = authSchema.parse(req.body);
  const existingUser = await prisma.user.findUnique({
    where: { login: data.login },
  });
  if (existingUser) {
    throw new HttpError(409, "Пользователь с таким логином уже существует");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        login: data.login,
        password: passwordHash,
        phone: data.phone,
        role: data.role,
      },
    });

    if (data.role === Role.CLIENT) {
      await tx.client.create({
        data: {
          userId: createdUser.id,
          companyName: data.companyName,
        },
      });
    }

    if (data.role === Role.MUSICIAN) {
      await tx.musician.create({
        data: {
          userId: createdUser.id,
        },
      });
    }

    return createdUser;
  });

  const token = signToken({ id: user.id, login: user.login, role: user.role });

  res.status(201).json({
    token,
    redirectPath: getRedirectPath(user.role),
    user: {
      id: user.id,
      login: user.login,
      role: user.role,
      phone: user.phone,
    },
  });
}

export async function login(req: Request, res: Response) {
  const data = authSchema
    .pick({ login: true, password: true, role: true })
    .parse(req.body);

  const user = await prisma.user.findUnique({ where: { login: data.login } });
  if (!user) {
    throw new HttpError(401, "Неверный логин или пароль");
  }

  if (user.role !== data.role) {
    throw new HttpError(
      403,
      "Выбранная роль не соответствует роли пользователя",
    );
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Неверный логин или пароль");
  }

  const token = signToken({ id: user.id, login: user.login, role: user.role });

  res.json({
    token,
    redirectPath: getRedirectPath(user.role),
    user: {
      id: user.id,
      login: user.login,
      role: user.role,
      phone: user.phone,
    },
  });
}
