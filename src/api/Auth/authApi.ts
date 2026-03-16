import type { LoginCredentials } from "../../types/Auth";
import type { RegisterFormValues } from "../../types/IUser.type";
import { api } from "../ApiBase";

//funcion para registrar un nuevo usuario
export const postRegisterUserFn = async (data: RegisterFormValues) => {
  try {
    const response = await api.post("/auth/registro", data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

//funcion para iniciar session
export const postLoginUserFn = async (data: LoginCredentials) => {
  try {
    console.log("📤 Enviando login con datos:", data);
    const response = await api.post("/auth/login", data);
    console.log("✅ Respuesta de login:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en login:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
