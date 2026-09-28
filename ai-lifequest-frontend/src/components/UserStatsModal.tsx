import React from 'react';
import { CheckCircle2, Swords, Target, Trophy, X } from 'lucide-react';
import type { User } from '../types/index';
import { calculateLevelData } from '../utils/levelCalculator';
import xpImg from '../assets/xp.png';
import './UserStatsModal.css';

interface UserStatsModalProps {
  user: User;
  activeGoalsCount: number;
  completedGoalsCount: number;
  activeChallengesCount: number;
  completedChallengesCount: number;
  onClose: () => void;
}

export const UserStatsModal: React.FC<UserStatsModalProps> = ({
  user,
  activeGoalsCount,
  completedGoalsCount,
  activeChallengesCount,
  completedChallengesCount,
  onClose,
}) => {
  const levelData = calculateLevelData(user.totalXp);

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X className="inline-icon" />
        </button>

        {/* Encabezado sin la palabra Jugador ni Estrella */}
        <div className="modal-header">
          <div className="modal-avatar">{getInitials(user.name)}</div>
          <div className="modal-user-info">
            <h3 className="modal-user-name">{user.name}</h3>
            <span className="modal-level-badge">Nivel {levelData.level}</span>
          </div>
        </div>

        {/* Sección de Nivel y Progreso */}
        <div className="modal-level-progress-section">
          <div className="modal-level-labels">
            <span>Progreso de Nivel {levelData.level}</span>
            <span style={{ color: 'var(--xp-color)' }}>
              {levelData.xpInCurrentLevel} / {levelData.xpRequiredForNextLevel} XP
            </span>
          </div>
          <div className="modal-level-bar-track">
            <div
              className="modal-level-bar-fill"
              style={{ width: `${levelData.progressPercentage}%` }}
            />
          </div>
          <div className="modal-level-subtext">
            Faltan {levelData.xpRequiredForNextLevel - levelData.xpInCurrentLevel} XP para el Nivel {levelData.level + 1}
          </div>

          {/* XP Total ubicado debajo del texto de XP que falta */}
          <div className="modal-total-xp-badge">
            <img src={xpImg} alt="XP Icon" style={{ width: '18px', height: '18px' }} />
            <span>XP Total Acumulada: </span>
            <strong style={{ color: 'var(--xp-color)' }}>{user.totalXp} PTS</strong>
          </div>
        </div>

        {/* Grilla dividida en columnas de a 2 para estadísticas */}
        <div className="modal-stats-grid-2">
          <div className="stat-box">
            <span className="stat-value" style={{ color: 'var(--primary)' }}>
              <Target className="inline-icon" />
              {activeGoalsCount}
            </span>
            <span className="stat-label">Metas Activas</span>
          </div>

          <div className="stat-box">
            <span className="stat-value" style={{ color: 'var(--success)' }}>
              <Trophy className="inline-icon" />
              {completedGoalsCount}
            </span>
            <span className="stat-label">Metas Terminadas</span>
          </div>

          <div className="stat-box">
            <span className="stat-value" style={{ color: '#818CF8' }}>
              <Swords className="inline-icon" />
              {activeChallengesCount}
            </span>
            <span className="stat-label">Retos Activos</span>
          </div>

          <div className="stat-box">
            <span className="stat-value" style={{ color: 'var(--success)' }}>
              <CheckCircle2 className="inline-icon" />
              {completedChallengesCount}
            </span>
            <span className="stat-label">Retos Terminados</span>
          </div>
        </div>
      </div>
    </div>
  );
};
