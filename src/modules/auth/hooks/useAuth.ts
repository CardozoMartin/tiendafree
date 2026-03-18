import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import {
  postLoginUserFn,
  postRegisterUserFn,
  postRequestPasswordResetFn,
  postResetPasswordFn,
} from '../api/authApi';
import { useAuthSessionStore } from '../store/useAuthSession';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import type { ILoginDatos, IRegistroDatos, LoginResponse } from '../types/Auth';


// ─── Helper para extraer el mensaje de error ─────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

// ─── Register ────────────────────────────────────────────────────────────────
export const useAuthRegister = () => {
  return useMutation({
    mutationFn: postRegisterUserFn,
    onSuccess: (data: ISuccessResponse<IRegistroDatos>) => {
      toast.success(data.mensaje);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const useAuthLogin = () => {
  const { login } = useAuthSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postLoginUserFn,
    onSuccess: (data: ISuccessResponse<LoginResponse>) => {
      const { accessToken, usuario } = data.datos;

      login(
        {
          userId: String(usuario.id),
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol ? [{ nombre: usuario.rol }] : [],
        },
        accessToken
      );

      toast.success(data.mensaje);
      setTimeout(() => navigate('/dashboard'), 500);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Request Password Reset ──────────────────────────────────────────────────
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: postRequestPasswordResetFn,
    onSuccess: (data: ISuccessResponse<null>) => {
      toast.success(data.mensaje);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ─── Reset Password ──────────────────────────────────────────────────────────
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, passwordNueva, confirmarPassword }: { token: string; passwordNueva: string; confirmarPassword: string }) => 
      postResetPasswordFn(token, passwordNueva, confirmarPassword),
    onSuccess: (data: ISuccessResponse<null>) => {
      toast.success(data.mensaje);
      setTimeout(() => navigate('/login'), 1500);
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};