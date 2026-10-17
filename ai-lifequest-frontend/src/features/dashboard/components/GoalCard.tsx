import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Target, Trophy, Pencil } from 'lucide-react';
import type { Goal, Challenge } from '../../../core/types/index';
import { ProgressBar } from './ProgressBar';
import { ChallengeCard } from './ChallengeCard';
import './GoalCard.css';

interface GoalCardProps {
  goal: Goal;
  challenges: Challenge[];
  onCompleteChallenge: (challengeId: string) => Promise<void>;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  challenges,
  onCompleteChallenge,
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = challenges.filter((c) => c.status === 'COMPLETED').length;
  const isGoalCompleted = goal.progressPercentage === 100;

  return (
    <div className={`goal-card ${isGoalCompleted ? 'goal-completed' : ''}`}>
      <div className="goal-card-header">
        <div className="goal-title-area">
          {goal.category && <span className="goal-category">{goal.category}</span>}
          <h2 className="goal-title">
            {isGoalCompleted && <Trophy className="inline-icon success-icon" />}
            {goal.title}
          </h2>
          {goal.description && <p className="goal-description">{goal.description}</p>}
        </div>

        <div className="goal-actions-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          {/* Botón para navegar a la vista de Edición */}
          <button
            type="button"
            className="edit-goal-btn"
            onClick={() => navigate(`/goals/edit/${goal.id}`)}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.2s ease',
            }}
          >
            <Pencil size={14} />
            <span>Editar</span>
          </button>

          {goal.targetDate && (
            <span className="goal-date">
              <CalendarDays className="inline-icon muted-icon" />
              {goal.targetDate}
            </span>
          )}
        </div>
      </div>

      {/* Componente Barra de Progreso */}
      <ProgressBar percentage={goal.progressPercentage} />

      {/* Encabezado Desplegable (Acordeón) de Retos */}
      <div className="goal-challenges-section">
        <button
          className="challenges-toggle-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          <span className="challenges-toggle-title">
            <Target className="inline-icon primary-icon" />
            Retos ({completedCount}/{challenges.length})
          </span>
          <span className="toggle-arrow">
            {isExpanded ? '▲ Ocultar retos' : '▼ Ver retos'}
          </span>
        </button>

        {/* Lista de Retos (Desplegable) */}
        {isExpanded && (
          <div className="challenges-list">
            {challenges.length === 0 ? (
              <p className="no-challenges-text">
                No hay retos agregados a esta meta aún.
              </p>
            ) : (
              challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onComplete={onCompleteChallenge}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};