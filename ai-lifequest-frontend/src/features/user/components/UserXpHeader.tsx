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
        <button
          type="button"
          className="header-brand"
          onClick={() => navigate('/dashboard')}
          title="Ir al Panel Principal"
        >
          <img src={logoImg} alt="AI LifeQuest Logo" className="header-logo" />
          <span className="header-title">AI LifeQuest</span>
        </button>

        {user && levelData ? (
          <div className="header-user-section">
            {/* Barra de Nivel e Indicador de XP interactivo (Abre el Modal de Estadísticas) */}
            <button
              type="button"
              className="xp-level-container"
              onClick={() => setShowModal(true)}
              title="Haz clic para ver tus estadísticas detalladas"
              aria-label={`Ver estadísticas de nivel ${levelData.level}`}
            >
              <span className="level-number-badge">LVL {levelData.level}</span>

              <span className="header-xp-info">
                <span className="header-xp-text">
                  <span className="header-xp-current">
                    <img src={xpImg} alt="" />
                    <span>{levelData.xpInCurrentLevel} XP</span>
                  </span>
                  <span className="header-xp-required">
                    / {levelData.xpRequiredForNextLevel}
                  </span>
                </span>

                <span className="header-xp-bar-track">
                  <span
                    className="header-xp-bar-fill"
                    style={{ width: `${levelData.progressPercentage}%` }}
                  />
                </span>
              </span>
            </button>

            {/* Perfil (Redirige a la página /profile) */}
            <button
              type="button"
              className="user-profile"
              onClick={() => navigate('/profile')}
              title="Ver mi Perfil y Configuración"
            >
              <span className="user-name">{user.name}</span>
              <span className="user-avatar">{getInitials(user.name)}</span>
            </button>
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
