import React from 'react';
import type { User } from '../types/index';
import { UserXpHeader } from '../components/UserXpHeader';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Header con Logo, XP, Nombre e Iniciales */}
      <UserXpHeader user={user} onLogout={onLogout} />

      {/* Contenido Sencillo de Bienvenida */}
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2.5rem',
          marginTop: '2rem',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.8rem', marginBottom: '1rem' }}>
            🎉 ¡Bienvenido a tu Panel, {user.name}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            Autenticación y Sesión validadas con éxito. Tu cuenta fue creada/cargada en el simulador.
          </p>

          <div style={{
            display: 'inline-block',
            padding: '1rem 1.5rem',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '8px',
            border: '1px dashed var(--primary)',
            marginBottom: '2rem'
          }}>
            <span style={{ color: 'var(--text-muted)' }}>Correo Registrado: </span>
            <strong style={{ color: 'var(--primary)' }}>{user.email}</strong>
          </div>

          <div>
            <button
              onClick={onLogout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
                border: '1px solid #EF4444',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};