import { useState, useMemo } from 'react';
import logoImg from '../assets/IA_LQ_v2.png';
import { LoginForm } from '../forms/LoginForm.tsx';
import { RegisterForm } from '../forms/RegisterForm.tsx';
import './AuthPage.css';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  // Puntos flotantes generados aleatoriamente
  const particles = useMemo(() => {
    const colors = ['var(--primary)', 'var(--xp-color)', 'var(--success)', '#818CF8'];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 4}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
  }, []);

  return (
    <div className="auth-page-container">
      {/* 1. Ola de gradiente diagonal */}
      <div className="auth-diagonal-wave" />

      {/* 2. Partículas animadas */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="auth-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* 3. Tarjeta central de autenticación */}
      <div className="auth-card">
        <div className="auth-logo-container">
          <img src={logoImg} alt="AI LifeQuest Logo" className="auth-logo-image" />
          <h1 className="auth-app-title">AI LifeQuest</h1>
          <p className="auth-app-subtitle">Toma el control de tus metas y sube de nivel</p>
        </div>

        {/* Pestañas de alternancia */}
        <div className="auth-toggle-container">
          <button
            onClick={() => setIsLogin(true)}
            className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario Renderizado */}
        <div style={{ marginTop: '1.5rem' }}>
          {isLogin ? (
            <LoginForm onSuccess={onLoginSuccess} />
          ) : (
            <RegisterForm onSuccess={onLoginSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}