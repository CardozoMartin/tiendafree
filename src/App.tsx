import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChangePassPage } from './modules/auth/pages/ChangePassPage';
import Dashboard from './modules/dashboard/pages/Dashboard';
import HomePage from './pages/HomePage';

import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import { RecoveryPassPage } from './modules/auth/pages/RecoveryPassPage';
import PublicStorePage from './pages/PublicStorePage';
import DemoStorePage from './pages/DemoStoragePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas - Con Header */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage></RegisterPage>} />
          <Route path="/recover-password" element={<RecoveryPassPage />} />
          <Route path="/change-password" element={<ChangePassPage />} />
        </Route>

        {/* Rutas Privadas - Sin Header */}
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo/:nombre" element={<DemoStorePage />} />
        </Route>
        <Route path="/tienda/:slug" element={<PublicStorePage />} />
        {/* Rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
