import type { LoginCredentials } from '../../types/Auth';
import type { RegisterFormValues } from '../../types/IUser.type';
import { api } from '../ApiBase';

//funcion para registrar un nuevo usuario
export const postRegisterUserFn = async (data: RegisterFormValues) => {
  try {
    const response = await api.post('/auth/registro', data);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

//funcion para iniciar session
export const postLoginUserFn = async (data: LoginCredentials) => {
  try {
    console.log('📤 Enviando login con datos:', data);
    const response = await api.post('/auth/login', data);
    console.log('✅ Respuesta de login:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error en login:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

//funcion para pedir el reseteo de contraseña
export const postRequestPasswordResetFn = async (email: string) => {
  try {
    const response = await api.post('/auth/solicitar-reset', { email });
    return response.data;
  } catch (error) {
    console.error('Error al solicitar reseteo de contraseña:', error);
    throw error;
  }
};

//funcion para resetear la contraseña
export const postResetPasswordFn = async (
  token: string,
  passwordNueva: string,
  confirmarPassword: string
) => {
  try {
    console.log('📤 Enviando reset de contraseña con:', {
      token,
      passwordNueva,
      confirmarPassword,
    });
    const response = await api.post(`/auth/confirmar-reset/${token}`, {
      passwordNueva,
      confirmarPassword,
    });
    console.log('✅ Respuesta de reset:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error al resetear contraseña:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: error.config,
    });
    throw error;
  }
};
