import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuthSessionStore } from '../store/useAuthSession';

const PublicRoutes = () => {
  const { isLoggedIn } = useAuthSessionStore();

  // Si el usuario ya está logueado, redirigir al dashboard
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
