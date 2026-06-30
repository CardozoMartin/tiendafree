// PublicRoutes.tsx
import { ROUTES } from '@constants/routes';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Header from '../components/common/Header';
import { useAuthSessionStore } from '../modules/auth/store/useAuthSession';

const PublicRoutes = () => {
  const isLoggedIn = useAuthSessionStore(useShallow((s) => s.isLoggedIn));
  const location = useLocation();
  const isHome = location.pathname === ROUTES.HOME;

  if (isLoggedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <>
      {!isHome && <Header />}
      <Outlet />
    </>
  );
};

export default PublicRoutes;
