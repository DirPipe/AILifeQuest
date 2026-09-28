import type { User, Goal, Challenge } from '../types/index';
import {
  getStoredUsers,
  saveUsers,
  getStoredGoals,
  saveGoals,
  getStoredChallenges,
  saveChallenges,
} from './mockData';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Auth: Login
  login: async (email: string): Promise<User> => {
    await delay();
    const users = getStoredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!foundUser) {
      throw new Error('Usuario no encontrado. Revisa tu correo electrónico.');
    }
    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      totalXp: foundUser.totalXp,
    };
  },

  // Auth: Register
  register: async (payload: { name: string; email: string }): Promise<User> => {
    await delay();
    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }
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

  // Users: Consultar datos del usuario
  getUser: async (userId: string): Promise<User> => {
    await delay();
    const users = getStoredUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Usuario no encontrado.');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      totalXp: user.totalXp,
    };
  },

  // Goals: Listar metas por usuario
  getGoalsByUser: async (userId: string): Promise<Goal[]> => {
    await delay();
    const goals = getStoredGoals();
    return goals.filter((g) => g.userId === userId);
  },

  // Goals: Crear meta
  createGoal: async (payload: {
    userId: string;
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  }): Promise<Goal> => {
    await delay();
    const goals = getStoredGoals();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      userId: payload.userId,
      title: payload.title,
      description: payload.description || '',
      category: payload.category || 'General',
      targetDate: payload.targetDate || '2026-12-31',
      progressPercentage: 0,
      status: 'IN_PROGRESS',
    };
    goals.push(newGoal);
    saveGoals(goals);
    return newGoal;
  },

  // Challenges: Listar retos por meta
  getChallengesByGoal: async (goalId: string): Promise<Challenge[]> => {
    await delay();
    const challenges = getStoredChallenges();
    return challenges.filter((c: Challenge) => c.goalId === goalId);
  },

  // Challenges: Crear reto
  createChallenge: async (payload: {
    goalId: string;
    title: string;
    description?: string;
    xpReward: number;
  }): Promise<Challenge> => {
    await delay();
    const challenges = getStoredChallenges();
    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      goalId: payload.goalId,
      title: payload.title,
      description: payload.description || '',
      xpReward: payload.xpReward,
      status: 'AVAILABLE',
    };
    challenges.push(newChallenge);
    saveChallenges(challenges);

    // Recalcular el porcentaje de progreso de la meta contenedora
    const goals = getStoredGoals();
    const goalIndex = goals.findIndex((g) => g.id === payload.goalId);
    if (goalIndex !== -1) {
      const goalChallenges = challenges.filter((c: Challenge) => c.goalId === payload.goalId);
      const completedCount = goalChallenges.filter((c: Challenge) => c.status === 'COMPLETED').length;
      const progress = Math.round((completedCount / goalChallenges.length) * 100);
      goals[goalIndex].progressPercentage = progress;
      goals[goalIndex].status = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';
      saveGoals(goals);
    }

    return newChallenge;
  },

  // Challenges: Completar reto (PATCH /api/challenges/complete)
  completeChallenge: async (challengeId: string): Promise<{ updatedXp: number; goalProgress: number }> => {
    await delay();
    const challenges = getStoredChallenges();
    const challenge = challenges.find((c: Challenge) => c.id === challengeId);

    if (!challenge) {
      throw new Error('Reto no encontrado.');
    }
    if (challenge.status === 'COMPLETED') {
      throw new Error('El reto ya ha sido completado anteriormente.');
    }

    // 1. Marcar reto como completado
    challenge.status = 'COMPLETED';
    challenge.completedAt = new Date().toISOString();
    saveChallenges(challenges);

    // 2. Incrementar la XP del usuario
    const goals = getStoredGoals();
    const parentGoal = goals.find((g) => g.id === challenge.goalId);
    let updatedXp = 0;

    if (parentGoal) {
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === parentGoal.userId);
      if (userIndex !== -1) {
        users[userIndex].totalXp = (users[userIndex].totalXp || 0) + challenge.xpReward;
        updatedXp = users[userIndex].totalXp;
        saveUsers(users);
      }

      // 3. Recalcular el porcentaje de progreso de la meta
      const goalChallenges = challenges.filter((c: Challenge) => c.goalId === parentGoal.id);
      const completedCount = goalChallenges.filter((c: Challenge) => c.status === 'COMPLETED').length;
      const progress = Math.round((completedCount / goalChallenges.length) * 100);

      const goalIndex = goals.findIndex((g) => g.id === parentGoal.id);
      if (goalIndex !== -1) {
        goals[goalIndex].progressPercentage = progress;
        goals[goalIndex].status = progress === 100 ? 'COMPLETED' : 'IN_PROGRESS';
        saveGoals(goals);
      }

      return { updatedXp, goalProgress: progress };
    }

    return { updatedXp: 0, goalProgress: 0 };
  },
};