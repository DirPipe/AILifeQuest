import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import type { User } from './core/types/index';
import { apiService } from './core/services/api';
import { AppRouter } from './routes/AppRouter';
import './App.css';

const SESSION_USER_ID_KEY = 'lq_current_user_id';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUserId = localStorage.getItem(SESSION_USER_ID_KEY);

      if (!storedUserId) {
        setIsRestoringSession(false);
        return;
      }

      try {
        const user = await apiService.getUser(storedUserId);
        setCurrentUser(user);
      } catch (error) {
        console.error('No se pudo restaurar la sesión:', error);
        localStorage.removeItem(SESSION_USER_ID_KEY);
      } finally {
        setIsRestoringSession(false);
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (user: User) => {
    localStorage.setItem(SESSION_USER_ID_KEY, user.id);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_USER_ID_KEY);
    setCurrentUser(null);
  };

  // Pantalla de carga mientras se verifica la sesión
  if (isRestoringSession) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-card">
          <span className="app-loading-title">Cargando sesión...</span>
          <span className="app-loading-subtitle">Sincronizando tu progreso</span>
        </div>
      </div>
    );
  }

  // Envolver AppRouter dentro de BrowserRouter
  return (
    <BrowserRouter>
      <AppRouter
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}