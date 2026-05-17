import {
  AdvertisementStatus,
  NotificationType,
  ResponseStatus,
} from "@prisma/client";
import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/httpError";

const advertisementSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  eventDate: z.string().datetime().or(z.string().min(1)),
  location: z.string().min(2),
  budget: z.coerce.number().positive(),
  requiredGenre: z.string().min(1),
  requiredInstrument: z.string().min(1),
  status: z.nativeEnum(AdvertisementStatus).optional(),
});

const advertisementUpdateSchema = advertisementSchema.partial();

const feedFiltersSchema = z.object({
  requiredGenre: z.string().optional(),
  requiredInstrument: z.string().optional(),
  budget: z.coerce.number().positive().optional(),
});

const responseStatusSchema = z.object({
  status: z.enum([ResponseStatus.ACCEPTED, ResponseStatus.REJECTED]),
});

function requireCurrentUser(req: Request) {
  if (!req.user) {
    throw new HttpError(401, "Требуется авторизация");
  }

  return req.user;
}

function normalizeRequirement(value?: string | null) {
  return value?.trim().toLowerCase();
}

export async function getAdvertisements(
  req: Request,
  res: Response,
) {
  const filters = feedFiltersSchema.parse(req.query);

  const advertisements = await prisma.advertisement.findMany({
    where: {
      status: AdvertisementStatus.PUBLISHED,
      requiredGenre: filters.requiredGenre
        ? { contains: filters.requiredGenre }
        : undefined,
      requiredInstrument: filters.requiredInstrument
        ? { contains: filters.requiredInstrument }
        : undefined,
      budget: filters.budget ? { gte: filters.budget } : undefined,
    },
    include: {
      client: {
        include: {
          user: {
            select: {
              id: true,
              login: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(advertisements);
}

export async function getMyAdvertisements(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);

  const advertisements = await prisma.advertisement.findMany({
    where: { clientId: currentUser.id },
    include: {
      responses: {
        include: {
          musician: {
            include: {
              user: {
                select: {
                  id: true,
                  login: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(advertisements);
}

export async function getAdvertisementById(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id);

  const advertisement = await prisma.advertisement.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          user: {
            select: {
              id: true,
              login: true,
              phone: true,
            },
          },
        },
      },
      responses: true,
    },
  });

  if (!advertisement) {
    throw new HttpError(404, "Объявление не найдено");
  }

  res.json(advertisement);
}

export async function createAdvertisement(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const data = advertisementSchema.parse(req.body);

  const advertisement = await prisma.advertisement.create({
    data: {
      clientId: currentUser.id,
      title: data.title,
      description: data.description,
      eventDate: new Date(data.eventDate),
      location: data.location,
      budget: data.budget,
      requiredGenre: data.requiredGenre,
      requiredInstrument: data.requiredInstrument,
      status: data.status || AdvertisementStatus.DRAFT,
    },
  });

  res.status(201).json(advertisement);
}

export async function updateAdvertisement(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const id = Number(req.params.id);
  const data = advertisementUpdateSchema.parse(req.body);

  const existingAdvertisement = await prisma.advertisement.findUnique({
    where: { id },
  });
  if (!existingAdvertisement) {
    throw new HttpError(404, "Объявление не найдено");
  }

  if (existingAdvertisement.clientId !== currentUser.id) {
    throw new HttpError(403, "Можно редактировать только свои объявления");
  }

  const advertisement = await prisma.advertisement.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      location: data.location,
      budget: data.budget,
      requiredGenre: data.requiredGenre,
      requiredInstrument: data.requiredInstrument,
      status: data.status,
    },
  });

  res.json(advertisement);
}

export async function deleteAdvertisement(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const id = Number(req.params.id);

  const existingAdvertisement = await prisma.advertisement.findUnique({
    where: { id },
  });
  if (!existingAdvertisement) {
    throw new HttpError(404, "Объявление не найдено");
  }

  if (existingAdvertisement.clientId !== currentUser.id) {
    throw new HttpError(403, "Можно удалить только свои объявления");
  }

  await prisma.advertisement.delete({ where: { id } });
  res.status(204).send();
}

export async function createResponse(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const advertisementId = Number(req.params.id);

  const musician = await prisma.musician.findUnique({
    where: { userId: currentUser.id },
  });
  if (!musician) {
    throw new HttpError(404, "Профиль музыканта не найден");
  }

  const advertisement = await prisma.advertisement.findUnique({
    where: { id: advertisementId },
  });
  if (!advertisement) {
    throw new HttpError(404, "Объявление не найдено");
  }

  if (advertisement.status !== AdvertisementStatus.PUBLISHED) {
    throw new HttpError(400, "Откликаться можно только на активные объявления");
  }

  const adGenre = normalizeRequirement(advertisement.requiredGenre);
  const musicianGenres = (musician.genre || "").split(",").map((g) => g.trim()).filter(Boolean).map(normalizeRequirement);
  const genreMatches = musicianGenres.length > 0 && musicianGenres.includes(adGenre);
  const instrumentMatches =
    normalizeRequirement(musician.instrument) ===
    normalizeRequirement(advertisement.requiredInstrument);

  if (!genreMatches || !instrumentMatches) {
    throw new HttpError(
      400,
      "Профиль музыканта не соответствует требованиям объявления",
    );
  }

  const response = await prisma.$transaction(async (tx) => {
    const createdResponse = await tx.response.create({
      data: {
        musicianId: currentUser.id,
        advertisementId,
      },
    });

    await tx.notification.create({
      data: {
        userId: advertisement.clientId,
        message: `Новый отклик на объявление ${advertisement.title}`,
        type: NotificationType.NEW_RESPONSE,
      },
    });

    return createdResponse;
  });

  res.status(201).json(response);
}

export async function getMyResponses(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);

  const responses = await prisma.response.findMany({
    where: { musicianId: currentUser.id },
    include: {
      advertisement: true,
    },
    orderBy: { id: "desc" },
  });

  res.json(responses);
}

export async function getAdvertisementResponses(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const advertisementId = Number(req.params.id);

  const advertisement = await prisma.advertisement.findUnique({
    where: { id: advertisementId },
  });
  if (!advertisement) {
    throw new HttpError(404, "Объявление не найдено");
  }

  if (advertisement.clientId !== currentUser.id) {
    throw new HttpError(
      403,
      "Можно просматривать отклики только на свои объявления",
    );
  }

  const responses = await prisma.response.findMany({
    where: { advertisementId },
    include: {
      musician: {
        include: {
          user: {
            select: {
              id: true,
              login: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  res.json(responses);
}

export async function updateResponseStatus(
  req: Request,
  res: Response,
) {
  const currentUser = requireCurrentUser(req);
  const id = Number(req.params.id);
  const data = responseStatusSchema.parse(req.body);

  const existingResponse = await prisma.response.findUnique({
    where: { id },
    include: { advertisement: true },
  });

  if (!existingResponse) {
    throw new HttpError(404, "Отклик не найден");
  }

  if (existingResponse.advertisement.clientId !== currentUser.id) {
    throw new HttpError(
      403,
      "Можно управлять откликами только на свои объявления",
    );
  }

  const notificationType =
    data.status === ResponseStatus.ACCEPTED
      ? NotificationType.RESPONSE_ACCEPTED
      : NotificationType.RESPONSE_REJECTED;
  const message =
    data.status === ResponseStatus.ACCEPTED
      ? "Ваш отклик принят"
      : "Ваш отклик отклонен";

  const response = await prisma.$transaction(async (tx) => {
    const updatedResponse = await tx.response.update({
      where: { id },
      data: { status: data.status },
    });

    await tx.notification.create({
      data: {
        userId: existingResponse.musicianId,
        message,
        type: notificationType,
      },
    });

    if (data.status === ResponseStatus.ACCEPTED) {
      await tx.advertisement.update({
        where: { id: existingResponse.advertisementId },
        data: { status: AdvertisementStatus.IN_PROGRESS },
      });
    }

    return updatedResponse;
  });

  res.json(response);
}
