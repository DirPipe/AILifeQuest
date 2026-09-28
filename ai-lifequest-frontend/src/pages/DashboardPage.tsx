import React, { useEffect, useState } from 'react';
import type { User, Goal, Challenge } from '../types/index';
import { apiService } from '../services/api';
import { UserXpHeader } from '../components/UserXpHeader';
import { GoalCard } from '../components/GoalCard';
import { CreateGoalForm } from '../forms/CreateGoalForm';
import { CreateChallengeForm } from '../forms/CreateChallengeForm';
import './DashboardPage.css';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user: initialUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challengesByGoal, setChallengesByGoal] = useState<Record<string, Challenge[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [activeChallengeGoalId, setActiveChallengeGoalId] = useState<string | null>(null);

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

  const handleGoalCreated = () => {
    setShowGoalForm(false);
    loadDashboardData();
  };

  const handleChallengeCreated = () => {
    setActiveChallengeGoalId(null);
    loadDashboardData();
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
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        {/* Encabezado Principal */}
        <div className="dashboard-header-section">
          <div>
            <h2 className="dashboard-title">Panel de Aventuras</h2>
            <p className="dashboard-subtitle">
              Gestiona tus metas activas y consulta tus logros terminados.
            </p>
          </div>
          <button
            onClick={() => setShowGoalForm(!showGoalForm)}
            className="submit-btn add-goal-btn"
          >
            {showGoalForm ? 'Cancelar' : '+ Nueva Meta'}
          </button>
        </div>

        {/* 2 Botones de Pestaña (Tabs) justo debajo del encabezado */}
        <div className="dashboard-tabs-container">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            <span>🎯 Metas Activas</span>
            <span className="tab-count-badge">{activeGoals.length}</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            <span>🏆 Metas Completadas</span>
            <span className="tab-count-badge">{completedGoals.length}</span>
          </button>
        </div>

        {/* Formulario para Crear Meta */}
        {showGoalForm && (
          <CreateGoalForm userId={currentUser.id} onGoalCreated={handleGoalCreated} />
        )}

        {/* Carga y Contenido según la pestaña seleccionada */}
        {isLoading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
            Cargando tus metas...
          </p>
        ) : activeTab === 'ACTIVE' ? (
          /* VISTA PESTAÑA: METAS ACTIVAS */
          <section className="dashboard-section">
            {activeGoals.length === 0 ? (
              <div className="empty-goals-card">
                <h4 className="empty-goals-title">No tienes metas activas</h4>
                <p className="empty-goals-desc">
                  ¡Haz clic en "+ Nueva Meta" para comenzar tu primera aventura!
                </p>
              </div>
            ) : (
              activeGoals.map((goal) => {
                const challenges = challengesByGoal[goal.id] || [];
                const isAddingChallenge = activeChallengeGoalId === goal.id;

                return (
                  <div key={goal.id}>
                    <GoalCard
                      goal={goal}
                      challenges={challenges}
                      onCompleteChallenge={handleCompleteChallenge}
                    />

                    <div className="add-challenge-toggle-area">
                      <button
                        onClick={() =>
                          setActiveChallengeGoalId(isAddingChallenge ? null : goal.id)
                        }
                        className="toggle-challenge-btn"
                      >
                        {isAddingChallenge
                          ? 'Cerrar formulario de reto'
                          : '+ Añadir un reto a esta meta'}
                      </button>

                      {isAddingChallenge && (
                        <CreateChallengeForm
                          goalId={goal.id}
                          onChallengeCreated={handleChallengeCreated}
                        />
                      )}
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