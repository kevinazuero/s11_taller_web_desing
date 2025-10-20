import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('❌ Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      alert('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const res = await api.post('/auth/register', { email, password, bio });
      alert('✅ Registro exitoso. Ya puedes iniciar sesión');
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || '❌ Error al registrarse');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <span className="text-white" style={{ fontSize: '2.5rem' }}>📝</span>
                  </div>
                  <h3 className="mt-3 fw-bold">Crear Cuenta</h3>
                  <p className="text-muted small">Completa los datos para registrarte</p>
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
                      className="form-control"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      🔑 Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      🔒 Confirmar Contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="bio" className="form-label fw-semibold">
                      👤 Biografía (Opcional)
                    </label>
                    <textarea
                      id="bio"
                      className="form-control"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Cuéntanos algo sobre ti..."
                      rows="3"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 fw-semibold mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      '🚀 Crear Cuenta'
                    )}
                  </button>

                  <div className="text-center">
                    <small className="text-muted">
                      ¿Ya tienes cuenta? 
                      <button 
                        type="button"
                        className="btn btn-link text-decoration-none p-0 ms-1"
                        onClick={() => nav('/')}
                      >
                        Inicia sesión aquí
                      </button>
                    </small>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
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