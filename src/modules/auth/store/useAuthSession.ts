// src/store/useSession.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { AuthState, DecodedToken, User } from "../types/Auth";

const CHECK_INTERVAL = 60000; // Verificar cada minuto

// Verifica si un token JWT ha expirado
const isTokenExpired = (exp: number): boolean => {
  const currentTime = Math.floor(Date.now() / 1000);
  // Agregar un buffer de 30 segundos para anticipar la expiración
  return exp < currentTime + 30;
};

// Valida y decodifica el token
const validateToken = (token: string | null): AuthState => {
  if (!token) {
    return {
      user: null,
      isLoggedIn: false,
      token: null,
    };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Verificar si el token ha expirado
    if (!decoded.exp || isTokenExpired(decoded.exp)) {
      return {
        user: null,
        isLoggedIn: false,
        token: null,
      };
    }

    // Token válido
    return {
      user: {
        userId: decoded.id,
        email: decoded.email,
        nombre: decoded.nombre,
        rol: decoded.roles,
      },
      isLoggedIn: true,
      token,
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return {
      user: null,
      isLoggedIn: false,
      token: null,
    };
  }
};

interface SessionStore extends AuthState {
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkSession: () => boolean;
  startSessionCheck: () => void;
  stopSessionCheck: () => void;
}

let intervalId: ReturnType<typeof setInterval> | null = null;

export const useAuthSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      token: null,

      login: (userData: User, token: string) => {
        let finalUser: User = userData;
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          finalUser = {
            userId: decoded.id || userData.userId,
            email: decoded.email || userData.email,
            nombre: decoded.nombre || userData.nombre,
            rol: decoded.roles || userData.rol,
          } as User;
        } catch {
          finalUser = userData;
        }

        set({
          user: finalUser,
          isLoggedIn: true,
          token,
        });

        get().startSessionCheck();
      },

      logout: () => {
        get().stopSessionCheck();
        set({
          user: null,
          isLoggedIn: false,
          token: null,
        });
      },

      checkSession: () => {
        const currentToken = get().token;
        const validatedState = validateToken(currentToken);

        if (!validatedState.isLoggedIn) {
          get().stopSessionCheck();
          set({
            user: null,
            isLoggedIn: false,
            token: null,
          });
          return false;
        }

        // Actualizar estado si es necesario
        if (validatedState.token !== currentToken) {
          set(validatedState);
        }

        return true;
      },

      startSessionCheck: () => {
        if (intervalId) {
          clearInterval(intervalId);
        }

        get().checkSession();

        intervalId = setInterval(() => {
          get().checkSession();
        }, CHECK_INTERVAL);
      },

      stopSessionCheck: () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      },
    }),
    {
      name: 'auth-storage', // nombre único para el storage
      // Opcionalmente puedes agregar una migración para limpiar tokens expirados
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          const validated = validateToken(state.token);
          if (!validated.isLoggedIn) {
            state.user = null;
            state.isLoggedIn = false;
            state.token = null;
          } else {
            state.startSessionCheck?.();
          }
        }
      },
    }
  )
);
