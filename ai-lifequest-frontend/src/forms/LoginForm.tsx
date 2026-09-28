import React, { useState } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types/index';
import './LoginForm.css';

interface LoginFormProps {
  onSuccess: (user: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      setIsLoading(true);
      // Consumimos el simulador de API para iniciar sesión
      const user = await apiService.login(email);
      onSuccess(user);
    } catch (error: any) {
      setErrorMessage(
        error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          Correo Electrónico
        </label>
        <input
          id="login-email"
          type="email"
          className="form-input"
          placeholder="ejemplo@lifequest.ai"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          className="form-input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? 'Iniciando Sesión...' : 'Entrar a LifeQuest 🚀'}
      </button>
    </form>
  );
};