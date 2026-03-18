// PublicRoutes.tsx
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuthSessionStore } from '../modules/auth/store/useAuthSession';
import { useShallow } from 'zustand/react/shallow';

const PublicRoutes = () => {
  const isLoggedIn = useAuthSessionStore(useShallow((s) => s.isLoggedIn));

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicRoutes;
