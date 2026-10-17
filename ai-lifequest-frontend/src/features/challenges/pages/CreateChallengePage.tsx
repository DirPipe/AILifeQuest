import React, { useState } from 'react';
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
  // Extrae el goalId directamente de la URL dinámicamente (/challenges/new/:goalId)
  const { goalId } = useParams<{ goalId: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!goalId) {
      setErrorMessage('No se encontró la meta asociada a este reto.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('El título del reto es requerido.');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.createChallenge({
        goalId,
        title,
        description,
        xpReward: Number(xpReward) || 50,
      });

      // Si existe callback navega, de lo contrario regresa al panel principal
      if (onChallengeCreated) {
        onChallengeCreated();
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al crear el reto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-challenge-page-container">
      <div className="create-challenge-card">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 className="challenge-form-title" style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Swords className="inline-icon primary-icon" />
            Agregar Nuevo Reto a esta Meta
          </h2>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Volver
          </button>
        </div>

        {errorMessage && (
          <div className="form-error" style={{ marginBottom: '0.8rem' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="ch-title">Título del Reto</label>
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
            <label className="form-label" htmlFor="ch-desc">Descripción</label>
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
            <label className="form-label" htmlFor="ch-xp">Recompensa XP</label>
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
            {isLoading ? 'Agregando...' : '+ Añadir Reto'}
          </button>
        </form>
      </div>
    </div>
  );
};