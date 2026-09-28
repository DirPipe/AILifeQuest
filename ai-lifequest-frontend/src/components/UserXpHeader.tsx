import React from 'react';
import type { User } from '../types/index';
import logoImg from '../assets/IA_LQ_v2.png';
import xpImg from '../assets/xp.png'; // 1. Importar la imagen de XP
import './UserXpHeader.css';

interface UserXpHeaderProps {
  user: User | null;
  onLogout?: () => void;
}

export const UserXpHeader: React.FC<UserXpHeaderProps> = ({ user, onLogout }) => {
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="xp-header">
      {/* Lado Izquierdo: Logo */}
      <div className="header-brand">
        <img src={logoImg} alt="AI LifeQuest Logo" className="header-logo" />
        <h1 className="header-title">AI LifeQuest</h1>
      </div>

      {/* Lado Derecho: XP + Avatar */}
      {user ? (
        <div className="header-user-section">
          {/* Badge de XP con la nueva imagen */}
          <div className="xp-badge" title="Puntos de Experiencia Acumulados">
            <img src={xpImg} alt="XP Icon" className="xp-icon" /> {/* 2. Reemplazo de la estrella por la imagen */}
            <span className="xp-amount">{user.totalXp} PTS</span>
          </div>

          <div
            className="user-profile"
            onClick={onLogout}
            style={{ cursor: onLogout ? 'pointer' : 'default' }}
            title={onLogout ? 'Clic para cerrar sesión' : ''}
          >
            <span className="user-name">{user.name}</span>
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      ) : (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Cargando...
        </span>
      )}
    </header>
  );
};