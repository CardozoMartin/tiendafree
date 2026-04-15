// PublicRoutes.tsx
import { ROUTES } from '@constants/routes';
import { Navigate, Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import Header from '../components/common/Header';
import { useAuthSessionStore } from '../modules/auth/store/useAuthSession';

const PublicRoutes = () => {
  const isLoggedIn = useAuthSessionStore(useShallow((s) => s.isLoggedIn));

  if (isLoggedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicRoutes;
