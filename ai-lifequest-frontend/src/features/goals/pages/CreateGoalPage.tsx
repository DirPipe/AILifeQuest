import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../../core/services/api';
import './CreateGoalPage.css';

interface CreateGoalPageProps {
  userId: string;
  onGoalCreated?: () => void;
}

export const CreateGoalPage: React.FC<CreateGoalPageProps> = ({ userId, onGoalCreated }) => {
  const navigate = useNavigate();
  const { goalId } = useParams<{ goalId: string }>();
  const isEditing = Boolean(goalId);

  // Obtener la fecha actual en formato ISO "YYYY-MM-DD"
  const getTodayString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tecnología');
  // Se inicializa con la fecha actual en lugar de dejar el estado vacío
  const [targetDate, setTargetDate] = useState(todayStr);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && goalId) {
      const loadGoalData = async () => {
        try {
          setIsLoading(true);
          const userGoals = await apiService.getGoalsByUser(userId);
          const currentGoal = userGoals.find((g) => g.id === goalId);

          if (currentGoal) {
            setTitle(currentGoal.title);
            setDescription(currentGoal.description || '');
            setCategory(currentGoal.category || 'Tecnología');
            setTargetDate(currentGoal.targetDate || todayStr);
          } else {
            setErrorMessage('No se encontró la meta especificada.');
          }
        } catch (error: any) {
          setErrorMessage(error.message || 'Error al cargar los datos de la meta.');
        } finally {
          setIsLoading(false);
        }
      };

      loadGoalData();
    }
  }, [goalId, isEditing, userId, todayStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('El título de la meta es obligatorio.');
      return;
    }

    // Validar que si no selecciona nada, use la fecha de hoy
    const selectedDate = targetDate.trim() || todayStr;

    // Validación para impedir seleccionar una fecha del pasado
    if (selectedDate < todayStr) {
      setErrorMessage('La fecha límite no puede ser anterior al día de hoy.');
      return;
    }

    try {
      setIsLoading(true);

      if (isEditing && goalId) {
        await apiService.updateGoal(goalId, {
          userId,
          title,
          description,
          category,
          targetDate: selectedDate,
        });
      } else {
        await apiService.createGoal({
          userId,
          title,
          description,
          category,
          targetDate: selectedDate,
        });
      }

      if (onGoalCreated) {
        onGoalCreated();
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al guardar la meta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-goal-page-container">
      <div className="create-goal-card">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>
            {isEditing ? '✏️ Editar Meta / Quest' : '🎯 Crear Nueva Meta / Quest'}
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

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="goal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="goal-title">Título de la Meta</label>
            <input
              id="goal-title"
              type="text"
              className="form-input"
              placeholder="Ej. Dominar Spring Boot y React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="goal-desc">Descripción (Opcional)</label>
            <textarea
              id="goal-desc"
              className="form-input"
              rows={3}
              placeholder="¿De qué trata esta aventura?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="goal-category">Categoría</label>
              <select
                id="goal-category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                <option value="Tecnología">Tecnología</option>
                <option value="Estudios">Estudios</option>
                <option value="Salud/Deporte">Salud / Deporte</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="goal-date">Fecha Límite</label>
              <input
                id="goal-date"
                type="date"
                className="form-input"
                value={targetDate}
                min={todayStr} // Bloquea en el selector de fecha del navegador los días anteriores a hoy
                onChange={(e) => setTargetDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading
              ? 'Guardando...'
              : isEditing
              ? '💾 Actualizar Meta'
              : '🚀 Guardar Meta'}
          </button>
        </form>
      </div>
    </div>
  );
};