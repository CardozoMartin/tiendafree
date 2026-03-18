import { api } from '../../../api/ApiBase';
import type { RegisterFormValues } from '../../../types/IUser.type';
import type { ILoginDatos } from '../types/Auth';


//Funcion para registrar un usuario
export const postRegisterUserFn = async (data: RegisterFormValues) => {
  const response = await api.post('/auth/registro', data);
  return response.data;
};
//Funcion para iniciar sesion
export const postLoginUserFn = async (data: ILoginDatos) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};
//Funcion para solicitar reset de contraseña
export const postRequestPasswordResetFn = async (email: string) => {
  const response = await api.post('/auth/solicitar-reset', { email });
  return response.data;
};
//Funcion para confirmar reset de contraseña
export const postResetPasswordFn = async (
  token: string,
  passwordNueva: string,
  confirmarPassword: string
) => {
  const response = await api.post(`/auth/confirmar-reset/${token}`, {
    passwordNueva,
    confirmarPassword,
  });
  return response.data;
};