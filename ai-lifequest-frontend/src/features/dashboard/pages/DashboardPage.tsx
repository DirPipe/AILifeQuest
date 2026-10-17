import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Target, Trophy } from 'lucide-react';
import type { User, Goal, Challenge } from '../../../core/types/index';
import { apiService } from '../../../core/services/api';
import { UserXpHeader } from '../../user/components/UserXpHeader';
import { GoalCard } from '../components/GoalCard';
import './DashboardPage.css';

interface DashboardPageProps {
  user: User;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user: initialUser }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challengesByGoal, setChallengesByGoal] = useState<Record<string, Challenge[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Estado para la pestaña activa: 'ACTIVE' (por defecto) o 'COMPLETED'
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const userGoals = await apiService.getGoalsByUser(currentUser.id);
      setGoals(userGoals);

      const challengesMap: Record<string, Challenge[]> = {};
      for (const goal of userGoals) {
        const goalChallenges = await apiService.getChallengesByGoal(goal.id);
        challengesMap[goal.id] = goalChallenges;
      }
      setChallengesByGoal(challengesMap);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const handleCompleteChallenge = async (challengeId: string) => {
    const response = await apiService.completeChallenge(challengeId);

    setCurrentUser((prev) => ({
      ...prev,
      totalXp: response.updatedXp,
    }));

    await loadDashboardData();
  };

  // Clasificación de metas
  const activeGoals = goals.filter((g) => g.progressPercentage < 100);
  const completedGoals = goals.filter((g) => g.progressPercentage === 100);

  // Métricas para el modal del encabezado
  const allChallenges = Object.values(challengesByGoal).flat();
  const activeChallengesCount = allChallenges.filter((c) => c.status !== 'COMPLETED').length;
  const completedChallengesCount = allChallenges.filter((c) => c.status === 'COMPLETED').length;

  return (
    <div className="dashboard-container">
      <UserXpHeader
        user={currentUser}
        activeGoalsCount={activeGoals.length}
        completedGoalsCount={completedGoals.length}
        activeChallengesCount={activeChallengesCount}
        completedChallengesCount={completedChallengesCount}
      />

      <main className="dashboard-main">
        {/* Encabezado Principal */}
        <div className="dashboard-header-section">
          <div>
            <span className="dashboard-eyebrow">Tu progreso, a tu ritmo</span>
            <h2 className="dashboard-title">Panel de Aventuras</h2>
            <p className="dashboard-subtitle">
              Gestiona tus metas activas y consulta tus logros terminados.
            </p>
          </div>
          {/* Redirección hacia la página dedicada para crear meta */}
          <button
            onClick={() => navigate('/goals/new')}
            className="submit-btn add-goal-btn"
          >
            <Plus size={17} />
            Nueva meta
          </button>
        </div>

        {/* 2 Botones de Pestaña (Tabs) justo debajo del encabezado */}
        <div className="dashboard-tabs-container" role="group" aria-label="Filtrar metas">
          <button
            type="button"
            aria-pressed={activeTab === 'ACTIVE'}
            className={`tab-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            <Target className="inline-icon primary-icon" />
            <span>Metas Activas</span>
            <span className="tab-count-badge">{activeGoals.length}</span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'COMPLETED'}
            className={`tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            <Trophy className="inline-icon success-icon" />
            <span>Metas Completadas</span>
            <span className="tab-count-badge">{completedGoals.length}</span>
          </button>
        </div>

        {/* Carga y Contenido según la pestaña seleccionada */}
        {isLoading ? (
          <p className="dashboard-loading" role="status">Cargando tus metas...</p>
        ) : activeTab === 'ACTIVE' ? (
          /* VISTA PESTAÑA: METAS ACTIVAS */
          <section className="dashboard-section">
            {activeGoals.length === 0 ? (
              <div className="empty-goals-card">
                <span className="empty-goals-icon"><Target size={24} /></span>
                <h4 className="empty-goals-title">No tienes metas activas</h4>
                <p className="empty-goals-desc">
                  Crea una meta y conviértela en pequeños retos que puedas completar cada día.
                </p>
              </div>
            ) : (
              activeGoals.map((goal) => {
                const challenges = challengesByGoal[goal.id] || [];

                return (
                  <div className="goal-list-item" key={goal.id}>
                    <GoalCard
                      goal={goal}
                      challenges={challenges}
                      onCompleteChallenge={handleCompleteChallenge}
                    />

                    {/* Botón con redirección a la vista dedicada para crear reto */}
                    <div className="add-challenge-toggle-area">
                      <button
                        onClick={() => navigate(`/challenges/new/${goal.id}`)}
                        className="toggle-challenge-btn"
                      >
                        <Plus size={16} />
                        Añadir un reto a esta meta
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        ) : (
          /* VISTA PESTAÑA: METAS COMPLETADAS */
          <section className="dashboard-section">
            {completedGoals.length === 0 ? (
              <div className="empty-goals-card">
                <span className="empty-goals-icon"><Trophy size={24} /></span>
                <h4 className="empty-goals-title">Aún no has completado ninguna meta</h4>
                <p className="empty-goals-desc">
                  Completa todos los retos de una meta para verla reflejada aquí.
                </p>
              </div>
            ) : (
              completedGoals.map((goal) => {
                const challenges = challengesByGoal[goal.id] || [];

                return (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    challenges={challenges}
                    onCompleteChallenge={handleCompleteChallenge}
                  />
                );
              })
            )}
          </section>
        )}
      </main>
    </div>
  );
};
