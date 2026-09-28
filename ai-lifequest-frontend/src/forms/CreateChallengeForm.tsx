import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { Challenge } from '../types/index';
import './CreateChallengeForm.css';

interface CreateChallengeFormProps {
  goalId: string;
  onChallengeCreated: (newChallenge: Challenge) => void;
}

export const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  goalId,
  onChallengeCreated,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title) {
      setErrorMessage('El título del reto es requerido.');
      return;
    }

    try {
      setIsLoading(true);
      const newChallenge = await apiService.createChallenge({
        goalId,
        title,
        description,
        xpReward: Number(xpReward) || 50,
      });

      setTitle('');
      setDescription('');
      setXpReward(50);
      onChallengeCreated(newChallenge);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al crear el reto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="challenge-form-card">
      <h4 className="challenge-form-title">⚔️ Agregar Nuevo Reto a esta Meta</h4>
      {errorMessage && <div className="form-error" style={{ marginBottom: '0.8rem' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor={`ch-title-${goalId}`}>Título del Reto</label>
          <input
            id={`ch-title-${goalId}`}
            type="text"
            className="form-input"
            placeholder="Ej. Configurar el enrutador de React"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor={`ch-desc-${goalId}`}>Descripción</label>
          <input
            id={`ch-desc-${goalId}`}
            type="text"
            className="form-input"
            placeholder="Detalles sobre lo que debes cumplir"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor={`ch-xp-${goalId}`}>Recompensa XP</label>
          <select
            id={`ch-xp-${goalId}`}
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

        <button type="submit" className="submit-btn" disabled={isLoading} style={{ backgroundColor: 'var(--success)' }}>
          {isLoading ? 'Agregando...' : '+ Añadir Reto'}
        </button>
      </form>
    </div>
  );
};