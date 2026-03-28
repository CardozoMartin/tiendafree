export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECOVER_PASSWORD: '/recover-password',
  CHANGE_PASSWORD: '/change-password',

  DASHBOARD: '/dashboard',
  DEMO_STORE: (nombre: string) => `/demo/${nombre}`,

  PUBLIC_STORE: (slug: string) => `/tienda/${slug}`,
} as const;

export type RouteKey = keyof typeof ROUTES;
