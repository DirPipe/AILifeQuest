import axios from 'axios';
import type { User, Goal, Challenge } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ==========================================================
   INTERFACES DE RESPUESTA DE LA API (DTOs del Backend)
   ========================================================== */

interface ApiErrorResponse {
  message?: string;
}

interface UserApiResponse {
  userId: string;
  name: string;
  email: string;
  totalXp: number;
  status: string;
}

interface AuthApiResponse extends UserApiResponse {}

interface GoalApiResponse {
  goalId: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  progress: number;
  status: Goal['status'];
}

interface ChallengeApiResponse {
  challengeId: string;
  goalId: string;
  title: string;
  description?: string;
  xpReward: number;
  status: Challenge['status'];
  completedAt?: string;
}

interface GameProgressApiResponse {
  user: UserApiResponse;
  goal: GoalApiResponse;
  challenge: ChallengeApiResponse;
  xpEarned: number;
}

/* ==========================================================
   FUNCIONES MAPPER (API DTO -> Modelo de Dominio Frontend)
   ========================================================== */

const mapUser = (user: UserApiResponse): User => ({
  id: user.userId,
  name: user.name,
  email: user.email,
  totalXp: user.totalXp,
});

const mapGoal = (goal: GoalApiResponse): Goal => ({
  id: goal.goalId,
  userId: goal.userId,
  title: goal.title,
  description: goal.description,
  category: goal.category,
  targetDate: goal.targetDate,
  progressPercentage: Math.round(goal.progress),
  status: goal.status,
});

const mapChallenge = (challenge: ChallengeApiResponse): Challenge => ({
  id: challenge.challengeId,
  goalId: challenge.goalId,
  title: challenge.title,
  description: challenge.description,
  xpReward: challenge.xpReward,
  status: challenge.status,
  completedAt: challenge.completedAt,
});

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el backend. Verifica que Spring Boot esté corriendo en http://localhost:8080.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

/* ==========================================================
   SERVICIO DE API (MÉTODOS Y ENDPOINTS)
   ========================================================== */

export const apiService = {
  // --------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await http.post<AuthApiResponse>('/auth/login', { email, password });
      return mapUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al iniciar sesión.'));
    }
  },

  register: async (payload: { name: string; email: string; password: string }): Promise<User> => {
    try {
      const response = await http.post<AuthApiResponse>('/auth/register', payload);
      return mapUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al registrar el usuario.'));
    }
  },

  // --------------------------------------------------------
  // USERS
  // --------------------------------------------------------
  getUser: async (userId: string): Promise<User> => {
    try {
      const response = await http.get<UserApiResponse>('/users', { params: { userId } });
      return mapUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al consultar el usuario.'));
    }
  },

  updateUser: async (
    userId: string,
    payload: { name?: string; email?: string }
  ): Promise<User> => {
    try {
      const response = await http.patch<UserApiResponse>(`/users/${userId}`, payload);
      return mapUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al actualizar el usuario.'));
    }
  },

  deactivateUser: async (userId: string): Promise<User> => {
    try {
      const response = await http.patch<UserApiResponse>(`/users/${userId}/deactivate`);
      return mapUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al desactivar el usuario.'));
    }
  },

  // --------------------------------------------------------
  // GOALS
  // --------------------------------------------------------
  getGoalsByUser: async (userId: string): Promise<Goal[]> => {
    try {
      const response = await http.get<GoalApiResponse[]>('/goals', { params: { userId } });
      return response.data.map(mapGoal);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al cargar las metas.'));
    }
  },

  createGoal: async (payload: {
    userId: string;
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  }): Promise<Goal> => {
    try {
      const response = await http.post<GoalApiResponse>('/goals', payload);
      return mapGoal(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al crear la meta.'));
    }
  },

 updateGoal: async (
    goalId: string,
    payload: {
      userId?: string;
      title?: string;
      description?: string;
      category?: string;
      targetDate?: string;
      status?: Goal['status'];
    }
  ): Promise<Goal> => {
    try {
      const response = await http.patch<GoalApiResponse>(`/goals/${goalId}`, payload);
      return mapGoal(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al actualizar la meta.'));
    }
  },

  // --------------------------------------------------------
  // CHALLENGES
  // --------------------------------------------------------
  getChallengesByGoal: async (goalId: string): Promise<Challenge[]> => {
    try {
      const response = await http.get<ChallengeApiResponse[]>('/challenges', { params: { goalId } });
      return response.data.map(mapChallenge);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al cargar los retos.'));
    }
  },

  createChallenge: async (payload: {
    goalId: string;
    title: string;
    description?: string;
    xpReward: number;
  }): Promise<Challenge> => {
    try {
      const response = await http.post<ChallengeApiResponse>('/challenges', payload);
      return mapChallenge(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al crear el reto.'));
    }
  },

  updateChallenge: async (
    challengeId: string,
    payload: {
      goalId?: string;
      title?: string;
      description?: string;
      xpReward?: number;
      status?: Challenge['status'];
    }
  ): Promise<Challenge> => {
    try {
      const response = await http.patch<ChallengeApiResponse>(`/challenges/${challengeId}`, payload);
      return mapChallenge(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al actualizar el reto.'));
    }
  },

  completeChallenge: async (
    challengeId: string
  ): Promise<{ updatedXp: number; goalProgress: number }> => {
    try {
      const response = await http.patch<GameProgressApiResponse>('/challenges/complete', {
        challengeId,
      });
      return {
        updatedXp: response.data.user.totalXp,
        goalProgress: Math.round(response.data.goal.progress),
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Error al completar el reto.'));
    }
  },
};