export interface IUserCreate {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profileCompleted?: boolean;
  acceptTerms?: boolean;
  imageProfile?: string;
  description?: string;
  hability?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface IUserUpdate {
  fullName?: string;
  email?: string;
  address?: string;
  phone?: string;
  password?: string;
  imageProfile?: string;
  codeVerification?: string;
  hability?: string[];
  description?: string;
}

export interface RegisterFormValues {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
}