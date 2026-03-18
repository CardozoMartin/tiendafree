import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  postLoginUserFn,
  postRegisterUserFn,
  postRequestPasswordResetFn,
  postResetPasswordFn,
} from '../api/authApi';
import { useAuthSessionStore } from '../store/useAuthSession';

//hook para registrar un nuevo usuario
export const useAuthRegister = () => {
  return useMutation({
    mutationFn: postRegisterUserFn,
    onSuccess: (data) => {
      toast.success('Usuario registrado con éxito');
      console.log('✅ Usuario registrado con éxito:', data);
    },
    onError: (error: unknown) => {
      console.error('❌ Error en hook register:', {
        // @ts-expect-error Accessing error response
        status: error?.response?.status,
        // @ts-expect-error Accessing error response
        data: error?.response?.data,
        // @ts-expect-error Accessing error response
        errores: error?.response?.data?.errores,
        // @ts-expect-error Accessing error response
        mensaje: error?.response?.data?.mensaje,
      });
      // No hacer toast aquí - el componente RegisterForm maneja los errores
    },
  });
};

//hook para iniciar sesión
export const useAuthLogin = () => {
  const { login } = useAuthSessionStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => postLoginUserFn(data),
    onSuccess: (responseData) => {
      console.log('📋 Datos de respuesta completo:', responseData);

      // Adaptar la respuesta del servidor: { ok, mensaje, datos: { accessToken, refreshToken, usuario } }
      const token = responseData?.datos?.accessToken;
      const user = responseData?.datos?.usuario;

      if (token && user) {
        // Mapear los campos del usuario a la estructura esperada
        const mappedUser = {
          userId: user.id,
          email: user.email,
          nombre: user.nombre,
          rol: user.rol,
        };

        login(mappedUser, token);

        // Redirigir al dashboard
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        toast.error('Respuesta incompleta del servidor');
      }
    },
    onError: (error: unknown) => {
      console.error('❌ Error en hook login:', {
        // @ts-expect-error Accessing error response
        status: error?.response?.status,
        // @ts-expect-error Accessing error response
        data: error?.response?.data,
        // @ts-expect-error Accessing error response
        message: error?.message,
      });
      // No hacer toast aquí - el componente LoginForm maneja los errores
    },
  });
};

//hook para pedir reseteo de contraseña
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: postRequestPasswordResetFn,
    onSuccess: (data) => {
      toast.success('Instrucciones enviadas a tu email');
      console.log('Instrucciones de reseteo enviadas:', data);
    },
    onError: (error: unknown) => {
      console.error('Error al solicitar reseteo de contraseña:', error);
      // @ts-expect-error Accessing error response
      const errorMessage = error?.response?.data?.message || 'Error al solicitar reseteo';
      toast.error(errorMessage);
    },
  });
};

//hook para resetear la contraseña
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      passwordNueva,
      confirmarPassword,
    }: {
      token: string;
      passwordNueva: string;
      confirmarPassword: string;
    }) => postResetPasswordFn(token, passwordNueva, confirmarPassword),
    onSuccess: (data) => {
      toast.success('Contraseña restablecida con éxito');
      console.log('Contraseña restablecida:', data);
    },
    onError: (error: unknown) => {
      console.error('Error al restablecer contraseña:', error);
      // @ts-expect-error Accessing error response
      const errorMessage = error?.response?.data?.message || 'Error al restablecer contraseña';
      toast.error(errorMessage);
    },
  });
};
