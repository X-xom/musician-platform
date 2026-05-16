export type Role = 'CLIENT' | 'MUSICIAN';

export type AdvertisementStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'CLOSED';
export type ResponseStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type NotificationType = 'NEW_RESPONSE' | 'RESPONSE_ACCEPTED' | 'RESPONSE_REJECTED' | 'SYSTEM';

export interface User {
  id: number;
  login: string;
  phone?: string | null;
  role: Role;
  createdAt?: string;
}

export interface ClientProfile {
  userId: number;
  companyName?: string | null;
}

export interface MusicianProfileData {
  userId: number;
  bio?: string | null;
  genre?: string | null;
  instrument?: string | null;
  experience?: string | null;
  education?: string | null;
  portfolioUrl?: string | null;
}

export interface Profile extends User {
  client?: ClientProfile | null;
  musician?: MusicianProfileData | null;
}

export interface Advertisement {
  id: number;
  clientId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  budget: string | number;
  requiredGenre: string;
  requiredInstrument: string;
  status: AdvertisementStatus;
  createdAt: string;
  responses?: ResponseItem[];
}

export interface ResponseItem {
  id: number;
  musicianId: number;
  advertisementId: number;
  status: ResponseStatus;
  advertisement?: Advertisement;
  musician?: MusicianProfileData & { user?: Pick<User, 'id' | 'login' | 'phone'> };
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface AuthPayload {
  login: string;
  password: string;
  role: Role;
  phone?: string;
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  redirectPath: string;
  user: User;
}
