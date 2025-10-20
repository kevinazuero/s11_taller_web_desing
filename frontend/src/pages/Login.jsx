import { useState } from 'react';
import api, { setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      
      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
        nav('/Home'); // Redirige al home
      }
    } catch (err) {
      alert(err.response?.data?.message || '❌ Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Logo o icono */}
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <span className="text-white" style={{ fontSize: '2.5rem' }}>🔐</span>
                  </div>
                  <h3 className="mt-3 fw-bold">Iniciar Sesión</h3>
                  <p className="text-muted small">Ingresa tus credenciales para continuar</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      📧 Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      🔑 Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Ingresando...
                      </>
                    ) : (
                      '🚀 Ingresar'
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    ¿No tienes cuenta? 
                    <button 
                      type="button"
                      className="btn btn-link text-decoration-none p-0 ms-1"
                      onClick={() => nav('/register')}
                    >
                      Regístrate aquí
                    </button>
                  </small>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="text-center mt-3">
              <small className="text-muted">
                © 2025 Sistema de Gestión. Todos los derechos reservados.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}