import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/api';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('⚠️ Debes iniciar sesión');
      navigate('/');
      return;
    }
    
    setAuthToken(token);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    setAuthToken(null);
    alert('👋 Sesión cerrada exitosamente');
    navigate('/');
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* Card principal */}
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header con botón cerrar sesión */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="mb-0">🏠 Sistema de Gestión</h2>
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                    title="Cerrar sesión"
                  >
                    🚪 Salir
                  </button>
                </div>

                {/* Mensaje de bienvenida */}
                <div className="text-center mb-5">
                  <h4 className="text-muted">¡Bienvenido!</h4>
                  <p className="text-muted">Selecciona el módulo que deseas gestionar</p>
                </div>

                <div className="row g-3">

                  {/* <div className="col-md-6">
                    <button
                      onClick={() => navigate('/tasks')}
                      className="btn btn-primary btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                      style={{ minHeight: '200px' }}
                    >
                      <div className="mb-3" style={{ fontSize: '4rem' }}>📋</div>
                      <h5 className="mb-2">Tareas SQL</h5>
                      <small className="text-white-50">Base de datos relacional</small>
                    </button>
                  </div> */}

                  <div className="col-md-6">
                    <button
                      onClick={() => navigate('/person')}
                      className="btn btn-primary btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                      style={{ minHeight: '200px' }}
                    >
                      <div className="mb-3" style={{ fontSize: '4rem' }}>👤</div>
                      <h5 className="mb-2">Personas</h5>
                      <small className="text-white-50">Base de datos relacional</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}