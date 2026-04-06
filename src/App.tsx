import { ROUTES } from '@constants/routes';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { toast } from 'sonner';

import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';

const HomePage = lazy(() => import('@modules/storefront/pages/HomePage'));
const PublicStorePage = lazy(() => import('@modules/storefront/pages/PublicStorePage'));
const DemoStorePage = lazy(() => import('@modules/templates/pages/DemoStoragePage'));
const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@modules/auth/pages/RegisterPage'));
const RecoveryPassPage = lazy(() =>
  import('@modules/auth/pages/RecoveryPassPage').then((m) => ({ default: m.RecoveryPassPage }))
);
const ChangePassPage = lazy(() =>
  import('@modules/auth/pages/ChangePassPage').then((m) => ({ default: m.ChangePassPage }))
);
const VerifyEmailPage = lazy(() =>
  import('@modules/auth/pages/VerifyEmailPage')
);
const Dashboard = lazy(() => import('@modules/dashboard/pages/Dashboard'));

function App() {
  useEffect(() => {
    const handleAuthExpired = () => {
      toast.error('Tu sesión ha expirado. Por favor inicia sesión de nuevo.');
    };

    window.addEventListener('app:auth-expired', handleAuthExpired);
    return () => window.removeEventListener('app:auth-expired', handleAuthExpired);
  }, []);

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full" />
          </div>
        }
      >
        <Routes>
          {/* Rutas Públicas - Con Header */}
          <Route element={<PublicRoutes />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<RecoveryPassPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ChangePassPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          </Route>

          {/* Rutas Privadas - Sin Header */}
          <Route element={<PrivateRoutes />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path="/demo/:nombre" element={<DemoStorePage />} />
          </Route>
          <Route path="/tienda/:slug" element={<PublicStorePage />} />
          {/* Rutas no encontradas */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
