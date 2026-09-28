import type { User, Goal, Challenge } from '../types/index';

// Llaves de almacenamiento local
const USERS_STORAGE_KEY = 'ailq_mock_users';
const GOALS_STORAGE_KEY = 'ailq_mock_goals';
const CHALLENGES_STORAGE_KEY = 'ailq_mock_challenges';

// Datos de prueba iniciales
const DEFAULT_USER: User = {
  id: 'usr-101',
  name: 'Jugador Cyber',
  email: 'player@lifequest.ai',
  totalXp: 150,
};

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    userId: 'usr-101',
    title: 'Aprender Desarrollo con React y Vite',
    description: 'Construir el frontend completo de AI LifeQuest con TypeScript',
    category: 'Tecnología',
    targetDate: '2026-10-15',
    progressPercentage: 50,
    status: 'IN_PROGRESS',
  },
];

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    goalId: 'goal-1',
    title: 'Crear el proyecto con Vite y TypeScript',
    description: 'Inicializar repositorio e instalar librerías iniciales',
    xpReward: 50,
    status: 'COMPLETED',
  },
  {
    id: 'ch-2',
    goalId: 'goal-1',
    title: 'Configurar la paleta de colores Cyberpunk',
    description: 'Definir variables CSS globales en index.css',
    xpReward: 100,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-3',
    goalId: 'goal-1',
    title: 'Conectar Frontend con el API Service',
    description: 'Implementar el simulador de endpoints ficticios',
    xpReward: 150,
    status: 'AVAILABLE',
  },
];

// Inicializar LocalStorage si está vacío
export const initMockDatabase = () => {
  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_USER]));
  }
  if (!localStorage.getItem(GOALS_STORAGE_KEY)) {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(DEFAULT_GOALS));
  }
  if (!localStorage.getItem(CHALLENGES_STORAGE_KEY)) {
    localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(DEFAULT_CHALLENGES));
  }
};

// Utilidades para leer y escribir en el simulador
export const getStoredUsers = (): User[] => {
  initMockDatabase();
  return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
};

export const getStoredGoals = (): Goal[] => {
  initMockDatabase();
  return JSON.parse(localStorage.getItem(GOALS_STORAGE_KEY) || '[]');
};

export const getStoredChallenges = (): Challenge[] => {
  initMockDatabase();
  return JSON.parse(localStorage.getItem(CHALLENGES_STORAGE_KEY) || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
};

export const saveChallenges = (challenges: Challenge[]) => {
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
};