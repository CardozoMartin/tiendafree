import { ROUTES } from '@constants/routes';
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthSessionStore } from '../modules/auth/store/useAuthSession';

const RoutesPrivate = () => {
  const isLoggedIn = useAuthSessionStore((s) => s.isLoggedIn);
  const checkSession = useAuthSessionStore((s) => s.checkSession);
  const startSessionCheck = useAuthSessionStore((s) => s.startSessionCheck);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = checkSession();
    setIsChecking(false);
    if (check) startSessionCheck();
  }, []); // sin dependencias — solo al montar

  useEffect(() => {
    if (!isChecking) checkSession();
  }, [location.pathname]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoutesPrivate;
