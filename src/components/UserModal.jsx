import { useState } from 'react';
import './UserModal.css';

export default function UserModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="user-modal-close" onClick={onClose} aria-label="Cerrar modal">
          ✕
        </button>

        <div className="user-modal-header">
          <span className="user-modal-eyebrow">Círculo Sutra</span>
          <h2 className="user-modal-title">
            {tab === 'login' ? 'Bienvenido a tu espacio' : 'Crea tu santuario'}
          </h2>
          <p className="user-modal-subtitle">
            {tab === 'login' 
              ? 'Accede para gestionar tus rituales, pedidos y eventos guardados.' 
              : 'Únete a nuestra comunidad consciente y recibe beneficios exclusivos.'}
          </p>
        </div>

        <div className="user-modal-tabs">
          <button 
            className={`user-modal-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`user-modal-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Registrarme
          </button>
        </div>

        {submitted ? (
          <div className="user-modal-success">
            <div className="user-modal-success-icon">✓</div>
            <h3>{tab === 'login' ? '¡Bienvenido de vuelta!' : '¡Cuenta creada con éxito!'}</h3>
            <p>Conectando con tu perfil Sutra...</p>
          </div>
        ) : (
          <form className="user-modal-form" onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label htmlFor="user-name">Nombre completo</label>
                <input 
                  type="text" 
                  id="user-name" 
                  required 
                  placeholder="Tu nombre" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="user-email">Correo electrónico</label>
              <input 
                type="email" 
                id="user-email" 
                required 
                placeholder="hola@ejemplo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-password">Contraseña</label>
              <input 
                type="password" 
                id="user-password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {tab === 'login' && (
              <div className="form-extra">
                <label className="remember-me">
                  <input type="checkbox" defaultChecked />
                  <span>Recordarme</span>
                </label>
                <a href="#recuperar" className="forgot-password" onClick={(e) => e.preventDefault()}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button type="submit" className="user-modal-btn">
              {tab === 'login' ? 'Ingresar a mi cuenta' : 'Crear mi cuenta'}
            </button>
          </form>
        )}

        <div className="user-modal-footer">
          <p>
            Al continuar, aceptas la filosofía y los{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>términos de privacidad</a> de Sutra México.
          </p>
        </div>
      </div>
    </div>
  );
}
