import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { Goal } from '../types/index';
import './CreateGoalForm.css';

interface CreateGoalFormProps {
  userId: string;
  onGoalCreated: (newGoal: Goal) => void;
}

export const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ userId, onGoalCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tecnología');
  const [targetDate, setTargetDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title) {
      setErrorMessage('El título de la meta es obligatorio.');
      return;
    }

    try {
      setIsLoading(true);
      const createdGoal = await apiService.createGoal({
        userId,
        title,
        description,
        category,
        targetDate: targetDate || '2026-12-31',
      });

      // Limpiar campos
      setTitle('');
      setDescription('');
      setTargetDate('');
      onGoalCreated(createdGoal);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al crear la meta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="goal-form-card">
      <h3 className="goal-form-title">🎯 Crear Nueva Meta / Quest</h3>
      {errorMessage && <div className="form-error" style={{ marginBottom: '1rem' }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-grid">
          <div className="form-group form-field-full">
            <label className="form-label" htmlFor="goal-title">Título de la Meta</label>
            <input
              id="goal-title"
              type="text"
              className="form-input"
              placeholder="Ej. Dominar React Native y TypeScript"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group form-field-full">
            <label className="form-label" htmlFor="goal-desc">Descripción (Opcional)</label>
            <textarea
              id="goal-desc"
              className="form-input"
              style={{ resize: 'vertical', minHeight: '60px' }}
              placeholder="¿De qué trata esta meta?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

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
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Creando Meta...' : '🚀 Guardar Meta'}
        </button>
      </form>
    </div>
  );
};