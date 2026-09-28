import React, { useState } from 'react';
import type { User } from '../types/index';
import logoImg from '../assets/IA_LQ_v2.png';
import xpImg from '../assets/xp.png';
import { calculateLevelData } from '../utils/levelCalculator';
import { UserStatsModal } from './UserStatsModal';
import './UserXpHeader.css';

interface UserXpHeaderProps {
  user: User | null;
  activeGoalsCount?: number;
  completedGoalsCount?: number;
  activeChallengesCount?: number;
  completedChallengesCount?: number;
  totalGoalsCount?: number;
  onLogout?: () => void;
}

export const UserXpHeader: React.FC<UserXpHeaderProps> = ({
  user,
  activeGoalsCount = 0,
  completedGoalsCount = 0,
  activeChallengesCount = 0,
  completedChallengesCount = 0,
  onLogout,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  const levelData = user ? calculateLevelData(user.totalXp) : null;

  return (
    <>
      <header className="xp-header">
        {/* Marca / Logo */}
        <div className="header-brand">
          <img src={logoImg} alt="AI LifeQuest Logo" className="header-logo" />
          <h1 className="header-title">AI LifeQuest</h1>
        </div>

        {user && levelData ? (
          <div className="header-user-section">
            {/* Barra de Nivel e Indicador de XP interactivo */}
            <div
              className="xp-level-container"
              onClick={() => setShowModal(true)}
              title="Haz clic para ver tus estadísticas detalladas"
            >
              <span className="level-number-badge">LVL {levelData.level}</span>

              <div className="header-xp-info">
                <div className="header-xp-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <img src={xpImg} alt="XP" style={{ width: '14px', height: '14px' }} />
                    <span>{levelData.xpInCurrentLevel} XP</span>
                  </div>
                  <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>
                    / {levelData.xpRequiredForNextLevel}
                  </span>
                </div>

                <div className="header-xp-bar-track">
                  <div
                    className="header-xp-bar-fill"
                    style={{ width: `${levelData.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Perfil */}
            <div
              className="user-profile"
              onClick={onLogout}
              style={{ cursor: onLogout ? 'pointer' : 'default' }}
              title={onLogout ? 'Clic para cerrar sesión' : ''}
            >
              <span className="user-name">{user.name}</span>
              <div className="user-avatar">{getInitials(user.name)}</div>
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Cargando...
          </span>
        )}
      </header>

      {/* Modal de Estadísticas */}
      {showModal && user && (
        <UserStatsModal
          user={user}
          activeGoalsCount={activeGoalsCount}
          completedGoalsCount={completedGoalsCount}
          activeChallengesCount={activeChallengesCount}
          completedChallengesCount={completedChallengesCount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};