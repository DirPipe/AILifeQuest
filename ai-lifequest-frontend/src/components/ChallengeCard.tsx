import React, { useState } from 'react';
import { CheckCircle2, Swords } from 'lucide-react';
import type { Challenge } from '../types/index';
import xpImg from '../assets/xp.png';
import './ChallengeCard.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => Promise<void>;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCompleted = challenge.status === 'COMPLETED';

  const handleCompleteClick = async () => {
    if (isCompleted || isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onComplete(challenge.id);
    } catch (error) {
      console.error('Error al completar el reto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`challenge-card ${isCompleted ? 'completed' : ''}`}>
      <div className="challenge-info">
        <span className="challenge-title">
          {isCompleted && <CheckCircle2 className="inline-icon success-icon" />}
          {challenge.title}
        </span>
        {challenge.description && (
          <p className="challenge-description">{challenge.description}</p>
        )}
      </div>

      <div className="challenge-actions">
        <div className="challenge-xp-badge">
          <img src={xpImg} alt="XP Icon" style={{ width: '16px', height: '16px' }} />
          <span>+{challenge.xpReward} XP</span>
        </div>

        {isCompleted ? (
          <span className="completed-badge">Completado</span>
        ) : (
          <button
            className="complete-btn"
            onClick={handleCompleteClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                Completar
                <Swords className="inline-icon" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
