import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swords } from 'lucide-react';
import { apiService } from '../../../core/services/api';
import './CreateChallengePage.css';

interface CreateChallengePageProps {
  onChallengeCreated?: () => void;
}

export const CreateChallengePage: React.FC<CreateChallengePageProps> = ({
  onChallengeCreated,
}) => {
  const navigate = useNavigate();
  // goalId estará presente al crear o editar desde la URL (/challenges/edit/:goalId/:challengeId)
  const { goalId, challengeId } = useParams<{ goalId?: string; challengeId?: string }>();
  const isEditing = Boolean(challengeId);

  const [currentGoalId, setCurrentGoalId] = useState<string | undefined>(goalId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar datos del reto si estamos en modo Edición
  useEffect(() => {
    if (isEditing && challengeId && goalId) {
      const loadChallengeData = async () => {
        try {
          setIsLoading(true);
          const challenges = await apiService.getChallengesByGoal(goalId);
          const currentChallenge = challenges.find((c) => c.id === challengeId);

          if (currentChallenge) {
            setTitle(currentChallenge.title);
            setDescription(currentChallenge.description || '');
            setXpReward(currentChallenge.xpReward);
            setCurrentGoalId(currentChallenge.goalId);
          } else {
            setErrorMessage('No se encontró el reto especificado.');
          }
        } catch (error: any) {
          setErrorMessage(error.message || 'Error al cargar los datos del reto.');
        } finally {
          setIsLoading(false);
        }
      };

      loadChallengeData();
    }
  }, [challengeId, goalId, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetGoalId = goalId || currentGoalId;

    if (!targetGoalId) {
      setErrorMessage('No se encontró la meta asociada a este reto.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('El título del reto es obligatorio.');
      return;
    }

    try {
      setIsLoading(true);

      if (isEditing && challengeId) {
        // Incluimos goalId para cumplir con la validación UpdateChallengeRequestDTO en Spring Boot
        await apiService.updateChallenge(challengeId, {
          goalId: targetGoalId,
          title,
          description,
          xpReward: Number(xpReward) || 50,
        });
      } else {
        // Modo Creación
        await apiService.createChallenge({
          goalId: targetGoalId,
          title,
          description,
          xpReward: Number(xpReward) || 50,
        });
      }

      if (onChallengeCreated) {
        onChallengeCreated();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al guardar el reto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-challenge-page-container">
      <div className="create-challenge-card">
        {/* Encabezado con botón de Regresar alineado a la derecha */}
        <div
          className="page-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.2rem',
          }}
        >
          <h2
            className="challenge-form-title"
            style={{
              margin: 0,
              fontSize: '1.3rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Swords className="inline-icon primary-icon" />
            {isEditing ? '✏️ Editar Reto' : '⚔️ Agregar Nuevo Reto'}
          </h2>

          <button
            type="button"
            className="submit-btn"
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.9rem',
              width: 'auto',
              margin: 0,
            }}
          >
            ← Regresar
          </button>
        </div>

        {errorMessage && (
          <div className="form-error" style={{ marginBottom: '0.8rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ch-title">
              Título del Reto
            </label>
            <input
              id="ch-title"
              type="text"
              className="form-input"
              placeholder="Ej. Configurar el enrutador de React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ch-desc">
              Descripción
            </label>
            <input
              id="ch-desc"
              type="text"
              className="form-input"
              placeholder="Detalles sobre lo que debes cumplir"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="ch-xp">
              Recompensa XP
            </label>
            <select
              id="ch-xp"
              className="form-input"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              disabled={isLoading}
            >
              <option value={25}>25 XP (Fácil)</option>
              <option value={50}>50 XP (Medio)</option>
              <option value={100}>100 XP (Difícil)</option>
              <option value={150}>150 XP (Épico)</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            style={{ backgroundColor: 'var(--success)', marginTop: '0.5rem' }}
          >
            {isLoading
              ? 'Guardando...'
              : isEditing
              ? '💾 Actualizar Reto'
              : '+ Añadir Reto'}
          </button>
        </form>
      </div>
    </div>
  );
};