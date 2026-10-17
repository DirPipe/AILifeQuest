import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ChevronDown, Target, Trophy, Pencil } from 'lucide-react';
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

        <div className="goal-actions-area">
          {/* Botón para navegar a la vista de Edición */}
          <button
            type="button"
            className="edit-goal-btn"
            onClick={() => navigate(`/goals/edit/${goal.id}`)}
            title="Editar meta"
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
          aria-expanded={isExpanded}
          aria-controls={`goal-challenges-${goal.id}`}
        >
          <span className="challenges-toggle-title">
            <Target className="inline-icon primary-icon" />
            Retos <span className="challenge-count">{completedCount} de {challenges.length} completados</span>
          </span>
          <span className="toggle-arrow">
            {isExpanded ? 'Ocultar retos' : 'Ver retos'}
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </button>

        {/* Lista de Retos (Desplegable) */}
        {isExpanded && (
          <div className="challenges-list" id={`goal-challenges-${goal.id}`}>
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
