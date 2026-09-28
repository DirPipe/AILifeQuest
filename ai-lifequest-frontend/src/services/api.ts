import type { User, Goal, Challenge } from '../types/index';

import {
  getStoredUsers,
  getStoredGoals,
  getStoredChallenges,
  saveUsers,
  saveGoals,
  saveChallenges,
} from './mockData';

// Simulación de retraso de red (Latency)
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// --- MÓDULO DE AUTENTICACIÓN Y USUARIOS ---

export const apiService = {
  // POST /api/auth/login
  login: async (email: string): Promise<User> => {
    await delay();
    const users = getStoredUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  },

  // GET /api/users?userId=...
  getUserById: async (userId: string): Promise<User> => {
    await delay();
    const users = getStoredUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  },

  // --- MÓDULO DE METAS (GOALS) ---

  // GET /api/goals?userId=...
  getGoalsByUser: async (userId: string): Promise<Goal[]> => {
    await delay();
    const goals = getStoredGoals();
    return goals.filter((g) => g.userId === userId);
  },

  // POST /api/goals
  createGoal: async (payload: {
    userId: string;
    title: string;
    description: string;
    category: string;
    targetDate: string;
  }): Promise<Goal> => {
    await delay();
    const goals = getStoredGoals();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: payload.userId,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      targetDate: payload.targetDate,
      progressPercentage: 0,
      status: 'IN_PROGRESS',
    };
    goals.push(newGoal);
    saveGoals(goals);
    return newGoal;
  },

  // --- MÓDULO DE RETOS (CHALLENGES) ---

  // GET /api/challenges?goalId=...
  getChallengesByGoal: async (goalId: string): Promise<Challenge[]> => {
    await delay();
    const challenges = getStoredChallenges();
    return challenges.filter((c) => c.goalId === goalId);
  },

  // POST /api/challenges
  createChallenge: async (payload: {
    goalId: string;
    title: string;
    description: string;
    xpReward: number;
  }): Promise<Challenge> => {
    await delay();
    const challenges = getStoredChallenges();
    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      goalId: payload.goalId,
      title: payload.title,
      description: payload.description,
      xpReward: payload.xpReward,
      status: 'AVAILABLE',
    };
    challenges.push(newChallenge);
    saveChallenges(challenges);

    // Recalcular porcentaje de la meta
    await apiService.recalculateGoalProgress(payload.goalId);

    return newChallenge;
  },

  // PATCH /api/challenges/complete
  completeChallenge: async (challengeId: string): Promise<{
    challenge: Challenge;
    updatedXp: number;
    updatedProgress: number;
  }> => {
    await delay();
    const challenges = getStoredChallenges();
    const challengeIndex = challenges.findIndex((c) => c.id === challengeId);

    if (challengeIndex === -1) {
      throw new Error('Reto no encontrado');
    }

    const challenge = challenges[challengeIndex];
    if (challenge.status === 'COMPLETED') {
      throw new Error('El reto ya ha sido completado anteriormente.');
    }

    // 1. Marcar reto como completado
    challenge.status = 'COMPLETED';
    challenges[challengeIndex] = challenge;
    saveChallenges(challenges);

    // 2. Sumar XP al usuario
    const goals = getStoredGoals();
    const parentGoal = goals.find((g) => g.id === challenge.goalId);
    let updatedXp = 0;

    if (parentGoal) {
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === parentGoal.userId);
      if (userIndex !== -1) {
        users[userIndex].totalXp += challenge.xpReward;
        updatedXp = users[userIndex].totalXp;
        saveUsers(users);
      }
    }

    // 3. Recalcular progreso porcentaje de la meta
    const updatedProgress = await apiService.recalculateGoalProgress(challenge.goalId);

    return {
      challenge,
      updatedXp,
      updatedProgress,
    };
  },

  // Función interna de apoyo para calcular progreso de la meta
  recalculateGoalProgress: async (goalId: string): Promise<number> => {
    const challenges = getStoredChallenges().filter((c) => c.goalId === goalId);
    const goals = getStoredGoals();
    const goalIndex = goals.findIndex((g) => g.id === goalId);

    if (goalIndex === -1) return 0;

    if (challenges.length === 0) {
      goals[goalIndex].progressPercentage = 0;
    } else {
      const completedCount = challenges.filter((c) => c.status === 'COMPLETED').length;
      const progress = Math.round((completedCount / challenges.length) * 100);
      goals[goalIndex].progressPercentage = progress;
      if (progress === 100) {
        goals[goalIndex].status = 'COMPLETED';
      }
    }

    saveGoals(goals);
    return goals[goalIndex].progressPercentage;
  },

  // POST /api/auth/register
  register: async (payload: { name: string; email: string }): Promise<User> => {
    await delay();
    const users = getStoredUsers();

    // Validar si el correo ya existe
    const existingUser = users.find((u) => u.email === payload.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    // Crear el nuevo usuario en el simulador
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      totalXp: 0,
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
  },
};