import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postLoginUserFn, postRegisterUserFn } from '../api/Auth/authApi';
import { useAuthSessionStore } from '../store/useAuthSession';


//hook para registrar un nuevo usuario
export const useAuthRegister = () => {
  return useMutation({
    mutationFn: postRegisterUserFn,
    onSuccess: (data) => {
      toast.success('Usuario registrado con éxito');
      console.log('Usuario registrado con éxito:', data);
    },
    onError: (error) => {
      console.error('Error al registrar usuario:', error);
      toast.error('Error al registrar usuario');
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
        toast.success('Inicio de sesión exitoso');
        console.log('✅ Usuario logueado con éxito:', mappedUser);
        console.log('🔐 Token guardado:', token.substring(0, 20) + '...');

        // Redirigir al dashboard
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        console.warn('⚠️ Respuesta incompleta - falta token o usuario');
        console.warn('Respuesta recibida:', responseData);
        toast.error('Respuesta incompleta del servidor');
      }
    },
    onError: (error: any) => {
      console.error('❌ Error en hook login:', error);
      const errorMessage = error?.response?.data?.message || 'Error al iniciar sesión';
      toast.error(errorMessage);
    },
  });
};
