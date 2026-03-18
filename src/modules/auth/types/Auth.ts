// src/types/auth.types.ts
export interface DecodedToken {
  id: string;
  email: string;
  exp: number;
  iat?: number;
  nombre?: string;
  roles?: Array<{ nombre: string }>;
}

export interface User {
  userId: string;
  email: string;
  nombre?: string;
  rol?: Array<{ nombre: string }>;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

export interface ILoginDatos {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    avatarUrl: string | null;
    emailVerificado: boolean;
  };
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface IRegistroDatos {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string;
}