import { useMutation } from "@tanstack/react-query";
import { postLoginUserFn, postRegisterUserFn } from "../api/Auth/authApi";
import { useSession } from "../store/useAuthSession";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

//hook para registrar un nuevo usuario
export const useAuthRegister = () => {
  return useMutation({
    mutationFn: postRegisterUserFn,
    onSuccess: (data) => {
        toast.success("Usuario registrado con éxito");
      console.log("Usuario registrado con éxito:", data);
    },
    onError: (error) => {
      console.error("Error al registrar usuario:", error);
      toast.error("Error al registrar usuario");
    },
  });
};

//hook para iniciar sesión
export const useAuthLogin = () => {
  const { login } = useSession();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => postLoginUserFn(data),
    onSuccess: (responseData) => {
      console.log("📋 Datos de respuesta:", responseData);
      
      // Supone que tu API retorna { user, token }
      if (responseData?.token && responseData?.user) {
        login(responseData.user, responseData.token);
        toast.success("Inicio de sesión exitoso");
        console.log("✅ Usuario logueado con éxito");
        
        // Redirigir al dashboard
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        console.warn("⚠️ Respuesta incompleta - falta token o user");
        toast.error("Respuesta incompleta del servidor");
      }
    },
    onError: (error: any) => {
      console.error("❌ Error en hook login:", error);
      const errorMessage = error?.response?.data?.message || "Error al iniciar sesión";
      toast.error(errorMessage);
    },
  });
};

