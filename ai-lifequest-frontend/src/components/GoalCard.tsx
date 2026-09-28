import React, { useState } from 'react';
import { CalendarDays, Target, Trophy } from 'lucide-react';
import type { Goal, Challenge } from '../types/index';
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
  // Estado para controlar el acordeón desplegable de retos
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
        {goal.targetDate && (
          <span className="goal-date">
            <CalendarDays className="inline-icon muted-icon" />
            {goal.targetDate}
          </span>
        )}
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
