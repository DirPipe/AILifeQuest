import { useState } from 'react';
import type { User } from './types/index';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Si no hay sesión, se muestra la AuthPage
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si hay sesión activa, entra al Dashboard con el Header responsivo
  return <DashboardPage user={currentUser} onLogout={handleLogout} />;
}