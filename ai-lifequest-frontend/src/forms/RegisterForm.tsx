import React, { useState } from 'react';
import type { User } from '../types/index';
import { apiService } from '../services/api';
import './RegisterForm.css';

interface RegisterFormProps {
  onSuccess: (user: User) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Llamada desacoplada a la API (simulada por ahora)
      const registeredUser = await apiService.register({ name, email });
      onSuccess(registeredUser);
    } catch (error: any) {
      setErrorMessage(
        error.message || 'Error al registrar el usuario. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {errorMessage && <div className="form-error">{errorMessage}</div>}

      <div className="form-group">
        <label className="form-label" htmlFor="register-name">
          Nombre de Jugador
        </label>
        <input
          id="register-name"
          type="text"
          className="form-input"
          placeholder="Ej. Alex Cyber"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="register-email">
          Correo Electrónico
        </label>
        <input
          id="register-email"
          type="email"
          className="form-input"
          placeholder="tu@lifequest.ai"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="register-password">
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          className="form-input"
          placeholder="Crea tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? 'Creando cuenta...' : '¡Registrarse y Jugar! ⚔️'}
      </button>
    </form>
  );
};