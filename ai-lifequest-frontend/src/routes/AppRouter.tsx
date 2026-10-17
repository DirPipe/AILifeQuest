import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { User } from '../core/types/index';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { CreateGoalPage } from '../features/goals/pages/CreateGoalPage';
import { CreateChallengePage } from '../features/challenges/pages/CreateChallengePage';

interface AppRouterProps {
  currentUser: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Si NO hay usuario autenticado */}
      {!currentUser ? (
        <>
          <Route path="/login" element={<AuthPage onLoginSuccess={onLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        /* Si SÍ hay usuario autenticado */
        <>
          {/* Redirección automática de la raíz a /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Ruta del Dashboard con URL /dashboard */}
          <Route
            path="/dashboard"
            element={<DashboardPage user={currentUser} onLogout={onLogout} />}
          />

          <Route
            path="/goals/new"
            element={
              <CreateGoalPage
                userId={currentUser.id}
                onGoalCreated={() => navigate('/dashboard')}
              />
            }
          />

          <Route
            path="/challenges/new/:goalId"
            element={
              <CreateChallengePage
                onChallengeCreated={() => navigate('/dashboard')}
              />
            }
          />

          {/* Comodín de seguridad: ante cualquier ruta desconocida redirige a /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
};