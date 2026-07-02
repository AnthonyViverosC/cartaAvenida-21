import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ConfigProvider } from './context/ConfigContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import Login from './pages/admin/Login.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Productos from './pages/admin/Productos.jsx';
import Categorias from './pages/admin/Categorias.jsx';
import Configuracion from './pages/admin/Configuracion.jsx';
import Promociones from './pages/admin/Promociones.jsx';
import Eventos from './pages/admin/Eventos.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ConfigProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Menú público */}
            <Route path="/" element={<App />} />

            {/* Login del panel */}
            <Route path="/admin/login" element={<Login />} />

            {/* Panel administrativo (protegido) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<Productos />} />
              <Route path="categorias" element={<Categorias />} />
              <Route path="promociones" element={<Promociones />} />
              <Route path="eventos" element={<Eventos />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ConfigProvider>
  </AuthProvider>
);
