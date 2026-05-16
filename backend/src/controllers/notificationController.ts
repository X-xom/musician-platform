import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

function requireCurrentUser(req: Request) {
  if (!req.user) {
    throw new HttpError(401, "Требуется авторизация");
  }

  return req.user;
}

export async function getNotifications(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);

  const notifications = await prisma.notification.findMany({
    where: { userId: currentUser.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(notifications);
}

export async function markNotificationAsRead(req: Request, res: Response) {
  const currentUser = requireCurrentUser(req);
  const id = Number(req.params.id);

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    throw new HttpError(404, "Уведомление не найдено");
  }

  if (notification.userId !== currentUser.id) {
    throw new HttpError(403, "Можно изменять только свои уведомления");
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.json(updatedNotification);
}
