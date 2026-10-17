import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, ShieldAlert, LogOut, Check, Target, Trophy, Swords, X } from 'lucide-react';
import type { User } from '../../../core/types/index';
import { apiService } from '../../../core/services/api';
import { calculateLevelData } from '../../../core/utils/levelCalculator';
import xpImg from '../../../assets/xp.png';
import './UserProfilePage.css';

interface UserProfilePageProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onLogout: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onUserUpdated,
  onLogout,
}) => {
  const navigate = useNavigate();

  // Estados para métricas en tiempo real
  const [activeGoalsCount, setActiveGoalsCount] = useState(0);
  const [completedGoalsCount, setCompletedGoalsCount] = useState(0);
  const [activeChallengesCount, setActiveChallengesCount] = useState(0);
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Estados del Modal de Edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Estado para la confirmación de desactivar cuenta
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  // Cargar estadísticas del usuario
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setIsStatsLoading(true);
        const userGoals = await apiService.getGoalsByUser(user.id);
        
        const activeGoals = userGoals.filter((g) => g.progressPercentage < 100);
        const completedGoals = userGoals.filter((g) => g.progressPercentage === 100);
        
        setActiveGoalsCount(activeGoals.length);
        setCompletedGoalsCount(completedGoals.length);

        let activeChCount = 0;
        let completedChCount = 0;

        for (const goal of userGoals) {
          const challenges = await apiService.getChallengesByGoal(goal.id);
          activeChCount += challenges.filter((c) => c.status !== 'COMPLETED').length;
          completedChCount += challenges.filter((c) => c.status === 'COMPLETED').length;
        }

        setActiveChallengesCount(activeChCount);
        setCompletedChallengesCount(completedChCount);
      } catch (error) {
        console.error('Error al cargar estadísticas del usuario:', error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    loadUserStats();
  }, [user.id]);

  const getInitials = (userName: string): string => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : userName.slice(0, 2).toUpperCase();
  };

  const levelData = calculateLevelData(user.totalXp);

  // Guardar cambios del Modal de Edición
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editName.trim() || !editEmail.trim()) {
      setModalError('El nombre y el correo no pueden estar vacíos.');
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await apiService.updateUser(user.id, {
        name: editName,
        email: editEmail,
      });
      onUserUpdated(updated);
      setShowEditModal(false);
    } catch (error: any) {
      setModalError(error.message || 'Error al actualizar el usuario.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Desactivar cuenta
  const handleDeactivateAccount = async () => {
    try {
      setIsDeactivating(true);
      await apiService.deactivateUser(user.id);
      onLogout();
      navigate('/login');
    } catch (error: any) {
      setPageError(error.message || 'Error al desactivar la cuenta.');
      setIsDeactivating(false);
    }
  };

  return (
    <div className="user-profile-page-container">
      <div className="user-profile-card">
        {/* HEADER COMPACTO */}
        <header className="profile-header">
          <div className="profile-header-user">
            <div className="profile-avatar">{getInitials(user.name)}</div>
            <div className="profile-user-titles">
              <h2 className="profile-user-name">{user.name}</h2>
              <span className="profile-user-email">{user.email}</span>
            </div>
          </div>

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
        </header>

        {pageError && <div className="form-error" style={{ marginBottom: '1rem' }}>{pageError}</div>}

        {/* 1. DATOS DE LA CUENTA */}
        <section className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              <UserIcon size={18} className="inline-icon primary-icon" />
              Datos de la Cuenta
            </h3>
            
            {/* Botón para abrir modal de edición */}
            <button
              type="button"
              className="submit-btn"
              onClick={() => {
                setEditName(user.name);
                setEditEmail(user.email);
                setModalError(null);
                setShowEditModal(true);
              }}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.85rem',
                width: 'auto',
                margin: 0,
                backgroundColor: 'var(--primary)',
              }}
            >
              ✏️ Editar Información
            </button>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nombre del Usuario</span>
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Correo Electrónico (Gmail)</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Experiencia Total (XP)</span>
              <span className="info-value xp-value">
                <img src={xpImg} alt="XP" style={{ width: '16px', height: '16px' }} />
                {user.totalXp} XP (Nivel {levelData.level})
              </span>
            </div>
          </div>
        </section>

        {/* 2. RESUMEN Y ESTADÍSTICAS DEL JUGADOR */}
        <section className="profile-section">
          <h3 className="section-title">📊 Resumen del Jugador</h3>
          
          {isStatsLoading ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
              Cargando métricas del usuario...
            </p>
          ) : (
            <div className="stats-embed-grid">
              <div className="stat-card">
                <Target size={22} className="primary-icon" />
                <div className="stat-info">
                  <span className="stat-value">{activeGoalsCount}</span>
                  <span className="stat-label">Metas Activas</span>
                </div>
              </div>

              <div className="stat-card">
                <Trophy size={22} className="success-icon" />
                <div className="stat-info">
                  <span className="stat-value">{completedGoalsCount}</span>
                  <span className="stat-label">Metas Completadas</span>
                </div>
              </div>

              <div className="stat-card">
                <Swords size={22} className="primary-icon" />
                <div className="stat-info">
                  <span className="stat-value">{activeChallengesCount}</span>
                  <span className="stat-label">Retos Pendientes</span>
                </div>
              </div>

              <div className="stat-card">
                <Check size={22} className="success-icon" />
                <div className="stat-info">
                  <span className="stat-value">{completedChallengesCount}</span>
                  <span className="stat-label">Retos Completados</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. CERRAR SESIÓN */}
        <section className="profile-section">
          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </section>

        {/* 4. ZONA DE PELIGRO (DESACTIVAR CUENTA) */}
        <section className="profile-section danger-zone">
          <h3 className="danger-title">
            <ShieldAlert size={18} />
            Zona de Peligro
          </h3>
          <p className="danger-desc">
            Desactivar tu cuenta deshabilitará tu acceso a la plataforma.
          </p>

          {!showDeactivateConfirm ? (
            <button
              type="button"
              className="deactivate-btn"
              onClick={() => setShowDeactivateConfirm(true)}
            >
              Desactivar Cuenta
            </button>
          ) : (
            <div className="deactivate-confirm-box">
              <p>¿Estás completamente seguro de que deseas desactivar tu cuenta?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="confirm-deactivate-btn"
                  onClick={handleDeactivateAccount}
                  disabled={isDeactivating}
                >
                  {isDeactivating ? 'Desactivando...' : 'Sí, Desactivar Mi Cuenta'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDeactivateConfirm(false)}
                  disabled={isDeactivating}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL PARA EDITAR DATO DEL USUARIO */}
      {showEditModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card">
            <div className="profile-modal-header">
              <h4>✏️ Editar Información de Usuario</h4>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {modalError && <div className="form-error" style={{ marginBottom: '0.8rem' }}>{modalError}</div>}

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="modal-name">Nombre Completo</label>
                <input
                  id="modal-name"
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="modal-email">Correo Electrónico (Gmail)</label>
                <input
                  id="modal-email"
                  type="email"
                  className="form-input"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isUpdating}
                  style={{ width: 'auto', padding: '0.5rem 1.2rem' }}
                >
                  {isUpdating ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};