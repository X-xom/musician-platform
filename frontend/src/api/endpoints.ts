import { api } from "./client";
import type {
  Advertisement,
  AdvertisementStatus,
  AuthPayload,
  AuthResponse,
  Notification,
  Profile,
  ResponseItem,
  ResponseStatus,
} from "../types/models";

export interface AdvertisementInput {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  budget: number;
  requiredGenre: string;
  requiredInstrument: string;
  status?: AdvertisementStatus;
}

export interface AdvertisementFilters {
  requiredGenre?: string;
  requiredInstrument?: string;
  budget?: string;
}

export const authApi = {
  register: async (payload: AuthPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    console.log(data);
    return data;
  },
  login: async (payload: AuthPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
};

export const profileApi = {
  get: async () => {
    const { data } = await api.get<Profile>("/profile");
    return data;
  },
  update: async (
    payload: Partial<
      Profile & {
        companyName: string;
        bio: string;
        genre: string;
        instrument: string;
        experience: string;
        education: string;
        portfolioUrl: string;
      }
    >,
  ) => {
    const { data } = await api.put<Profile>("/profile", payload);
    return data;
  },
  getMusician: async () => {
    const { data } = await api.get<Profile>("/musician/profile");
    return data;
  },
  updateMusician: async (payload: Record<string, string>) => {
    const { data } = await api.put<Profile>("/musician/profile", payload);
    return data;
  },
  getClient: async () => {
    const { data } = await api.get<Profile>("/client/profile");
    return data;
  },
  updateClient: async (payload: {
    login?: string;
    companyName?: string;
    phone?: string;
  }) => {
    const { data } = await api.put<Profile>("/client/profile", payload);
    return data;
  },
};

export const advertisementApi = {
  feed: async (filters: AdvertisementFilters = {}) => {
    const { data } = await api.get<Advertisement[]>("/advertisements", {
      params: filters,
    });
    return data;
  },
  my: async () => {
    const { data } = await api.get<Advertisement[]>("/advertisements/my");
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Advertisement>(`/advertisements/${id}`);
    return data;
  },
  create: async (payload: AdvertisementInput) => {
    const { data } = await api.post<Advertisement>("/advertisements", payload);
    return data;
  },
  update: async (id: number, payload: Partial<AdvertisementInput>) => {
    const { data } = await api.put<Advertisement>(
      `/advertisements/${id}`,
      payload,
    );
    return data;
  },
  remove: async (id: number) => {
    await api.delete(`/advertisements/${id}`);
  },
  respond: async (id: number) => {
    const { data } = await api.post<ResponseItem>(
      `/advertisements/${id}/response`,
    );
    return data;
  },
  responses: async (id: number) => {
    const { data } = await api.get<ResponseItem[]>(
      `/advertisements/${id}/responses`,
    );
    return data;
  },
};

export const responseApi = {
  my: async () => {
    const { data } = await api.get<ResponseItem[]>("/responses/my");
    return data;
  },
  setStatus: async (
    id: number,
    status: Extract<ResponseStatus, "ACCEPTED" | "REJECTED">,
  ) => {
    const { data } = await api.put<ResponseItem>(`/responses/${id}/status`, {
      status,
    });
    return data;
  },
};

export const notificationApi = {
  list: async () => {
    const { data } = await api.get<Notification[]>("/notifications");
    return data;
  },
  markAsRead: async (id: number) => {
    const { data } = await api.put<Notification>(`/notifications/${id}/read`);
    return data;
  },
};
