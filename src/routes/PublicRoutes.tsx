import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../store/useAuthSession';
import Header from '../components/common/Header';

const PublicRoutes = () => {
  const { isLoggedIn } = useSession();

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