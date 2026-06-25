import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificacionesProvider } from './context/NotificacionesContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogoPage from './pages/CatalogoPage';
import SubastaDetailPage from './pages/SubastaDetailPage';
import MisPujasPage from './pages/MisPujasPage';
import MisSubastasPage from './pages/MisSubastasPage';
import CrearSubastaPage from './pages/CrearSubastaPage';
import AdminPage from './pages/AdminPage';
import PerfilPage from './pages/PerfilPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/catalogo" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificacionesProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/catalogo" element={<CatalogoPage />} />
              <Route path="/subastas/:id" element={<SubastaDetailPage />} />
              <Route path="/mis-pujas" element={<MisPujasPage />} />
              <Route path="/mis-subastas" element={<MisSubastasPage />} />
              <Route path="/crear" element={<CrearSubastaPage />} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
              <Route path="/perfil" element={<PerfilPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/catalogo" replace />} />
            <Route path="*" element={<Navigate to="/catalogo" replace />} />
          </Routes>
        </NotificacionesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
