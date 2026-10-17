import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Swords, Pencil } from 'lucide-react';
import type { Challenge } from '../../../core/types/index';
import xpImg from '../../../assets/xp.png';
import './ChallengeCard.css';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (challengeId: string) => Promise<void>;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  const navigate = useNavigate();
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

  const handleEditClick = () => {
    // Redirige a la ruta de edición de retos enviando el goalId y el challengeId
    navigate(`/challenges/edit/${challenge.goalId}/${challenge.id}`);
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
        {/* Recompensa XP */}
        <div className="challenge-xp-badge">
          <img src={xpImg} alt="" />
          <span>+{challenge.xpReward} XP</span>
        </div>

        {/* Botón de Editar (Solo si el reto no ha sido completado aún) */}
        {!isCompleted && (
          <button
            type="button"
            className="edit-challenge-btn"
            onClick={handleEditClick}
            title="Editar reto"
            aria-label={`Editar reto: ${challenge.title}`}
          >
            <Pencil size={14} />
            <span>Editar</span>
          </button>
        )}

        {/* Botón o Badge de Estado Completado */}
        {isCompleted ? (
          <span className="completed-badge">Completado</span>
        ) : (
          <button
            type="button"
            className="complete-btn"
            onClick={handleCompleteClick}
            disabled={isSubmitting}
            aria-label={`Completar reto: ${challenge.title}`}
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
