export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  DASHBOARD: '/dashboard',

  PUBLIC_STORE: (slug: string) => `https://apptiendizi.netlify.app/${slug}`,
} as const;

export type RouteKey = keyof typeof ROUTES;
