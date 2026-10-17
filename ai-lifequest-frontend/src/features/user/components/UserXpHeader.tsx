import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../../core/types/index';
import logoImg from '../../../assets/IA_LQ_v2.png';
import xpImg from '../../../assets/xp.png';
import { calculateLevelData } from '../../../core/utils/levelCalculator';
import { UserStatsModal } from '../../dashboard/components/UserStatsModal';
import './UserXpHeader.css';

interface UserXpHeaderProps {
  user: User | null;
  activeGoalsCount?: number;
  completedGoalsCount?: number;
  activeChallengesCount?: number;
  completedChallengesCount?: number;
  totalGoalsCount?: number;
}

export const UserXpHeader: React.FC<UserXpHeaderProps> = ({
  user,
  activeGoalsCount = 0,
  completedGoalsCount = 0,
  activeChallengesCount = 0,
  completedChallengesCount = 0,
}) => {
  const navigate = useNavigate();
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
        {/* Marca / Logo (Redirige al Dashboard) */}
        <div
          className="header-brand"
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer' }}
          title="Ir al Panel Principal"
        >
          <img src={logoImg} alt="AI LifeQuest Logo" className="header-logo" />
          <h1 className="header-title">AI LifeQuest</h1>
        </div>

        {user && levelData ? (
          <div className="header-user-section">
            {/* Barra de Nivel e Indicador de XP interactivo (Abre el Modal de Estadísticas) */}
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

            {/* Perfil (Redirige a la página /profile) */}
            <div
              className="user-profile"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
              title="Ver mi Perfil y Configuración"
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