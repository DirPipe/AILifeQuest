import { useEffect, useState } from 'react';
import type { User } from './types/index';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { apiService } from './services/api';
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

  // Si no hay sesión, se muestra la AuthPage
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si hay sesión activa, entra al Dashboard con el Header responsivo
  return <DashboardPage user={currentUser} onLogout={handleLogout} />;
}
