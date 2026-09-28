import type { User, Goal, Challenge } from '../types/index';

export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'usr-1',
    name: 'Alex Cyber',
    email: 'alex@lifequest.ai',
    password: '1234',
    totalXp: 225,
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena@lifequest.ai',
    password: '1234',
    totalXp: 450,
  },
  {
    id: 'usr-3',
    name: 'Carlos Dev',
    email: 'carlos@lifequest.ai',
    password: '1234',
    totalXp: 50,
  },
];

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    userId: 'usr-1',
    title: 'Dominar Arquitectura de Software y React',
    description: 'Completar el desarrollo del MVP de AI LifeQuest para el Sprint 1.',
    category: 'Tecnología',
    targetDate: '2026-10-15',
    progressPercentage: 100,
    status: 'COMPLETED',
  },
  {
    id: 'goal-2',
    userId: 'usr-1',
    title: 'Preparación Física Cyberpunk',
    description: 'Entrenamiento semanal para mejorar resistencia física y postura.',
    category: 'Salud/Deporte',
    targetDate: '2026-11-30',
    progressPercentage: 33,
    status: 'IN_PROGRESS',
  },
  {
    id: 'goal-3',
    userId: 'usr-2',
    title: 'Especialización en Ciencia de Datos e IA',
    description: 'Aprender modelos de Machine Learning y Prompt Engineering avanzado.',
    category: 'Estudios',
    targetDate: '2026-12-01',
    progressPercentage: 100,
    status: 'COMPLETED',
  },
  {
    id: 'goal-4',
    userId: 'usr-2',
    title: 'Aprender Inglés C1 Profesional',
    description: 'Practicar fluidez verbal y vocabulario técnico para entrevistas internacionales.',
    category: 'Personal',
    targetDate: '2026-12-20',
    progressPercentage: 50,
    status: 'IN_PROGRESS',
  },
  {
    id: 'goal-5',
    userId: 'usr-3',
    title: 'Despliegue de Backend con Spring Boot',
    description: 'Configurar PostgreSQL, JPA Repositories y desplegar la API REST.',
    category: 'Tecnología',
    targetDate: '2026-10-30',
    progressPercentage: 25,
    status: 'IN_PROGRESS',
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'ch-101',
    goalId: 'goal-1',
    title: 'Diseñar los componentes visuales de gamificación',
    description: 'Crear Header, ProgressBar, GoalCard y ChallengeCard.',
    xpReward: 50,
    status: 'COMPLETED',
    completedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'ch-102',
    goalId: 'goal-1',
    title: 'Implementar pantalla de Auth con fondo neón',
    description: 'Construir AuthPage con partículas flotantes y ola diagonal.',
    xpReward: 100,
    status: 'COMPLETED',
    completedAt: '2026-09-22T14:30:00Z',
  },
  {
    id: 'ch-103',
    goalId: 'goal-2',
    title: 'Completar 30 minutos de cardio en la mañana',
    description: 'Trote continuo o bicicleta estática.',
    xpReward: 25,
    status: 'COMPLETED',
    completedAt: '2026-09-25T08:00:00Z',
  },
  {
    id: 'ch-104',
    goalId: 'goal-2',
    title: 'Rutina de calistenia y fuerza',
    description: '4 series de flexiones, sentadillas y dominadas.',
    xpReward: 50,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-105',
    goalId: 'goal-2',
    title: 'Sesión de estiramiento y ergonomía',
    description: 'Descomprimir espalda tras largas sesiones de código.',
    xpReward: 25,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-201',
    goalId: 'goal-3',
    title: 'Completar curso de Pandas y NumPy',
    description: 'Limpieza y procesamiento de datasets masivos.',
    xpReward: 100,
    status: 'COMPLETED',
    completedAt: '2026-09-10T16:00:00Z',
  },
  {
    id: 'ch-202',
    goalId: 'goal-3',
    title: 'Entrenar un modelo de clasificación con Scikit-Learn',
    description: 'Medir precisión, recall y matriz de confusión.',
    xpReward: 150,
    status: 'COMPLETED',
    completedAt: '2026-09-18T19:00:00Z',
  },
  {
    id: 'ch-203',
    goalId: 'goal-4',
    title: 'Escuchar 1 podcast de tecnología en inglés diario',
    description: 'Tomar notas de expresiones nativas.',
    xpReward: 50,
    status: 'COMPLETED',
    completedAt: '2026-09-26T11:00:00Z',
  },
  {
    id: 'ch-204',
    goalId: 'goal-4',
    title: 'Simular entrevista técnica en inglés con IA',
    description: 'Practicar respuestas bajo el método STAR.',
    xpReward: 100,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-301',
    goalId: 'goal-5',
    title: 'Crear entidades JPA para User, Goal y Challenge',
    description: 'Mapear anotaciones @Entity, @Table y relaciones @ManyToOne.',
    xpReward: 50,
    status: 'COMPLETED',
    completedAt: '2026-09-27T15:20:00Z',
  },
  {
    id: 'ch-302',
    goalId: 'goal-5',
    title: 'Implementar el caso de uso completeChallenge()',
    description: 'Asegurar anotación @Transactional para recalcular XP y progreso.',
    xpReward: 100,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-303',
    goalId: 'goal-5',
    title: 'Configurar endpoints limpios con Query Params',
    description: 'Evitar exponer variables de ruta en URLs.',
    xpReward: 50,
    status: 'AVAILABLE',
  },
  {
    id: 'ch-304',
    goalId: 'goal-5',
    title: 'Habilitar políticas CORS para React',
    description: 'Permitir peticiones HTTP desde localhost:5173.',
    xpReward: 25,
    status: 'AVAILABLE',
  },
];

// --- Helpers de Persistencia Local (Exportados) ---

export const getStoredUsers = (): (User & { password?: string })[] => {
  const data = localStorage.getItem('lq_users');
  if (!data) {
    localStorage.setItem('lq_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  }
  return JSON.parse(data);
};

export const saveUsers = (users: (User & { password?: string })[]) => {
  localStorage.setItem('lq_users', JSON.stringify(users));
};

export const getStoredGoals = (): Goal[] => {
  const data = localStorage.getItem('lq_goals');
  if (!data) {
    localStorage.setItem('lq_goals', JSON.stringify(MOCK_GOALS));
    return MOCK_GOALS;
  }
  return JSON.parse(data);
};

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem('lq_goals', JSON.stringify(goals));
};

export const getStoredChallenges = (): Challenge[] => {
  const data = localStorage.getItem('lq_challenges');
  if (!data) {
    localStorage.setItem('lq_challenges', JSON.stringify(MOCK_CHALLENGES));
    return MOCK_CHALLENGES;
  }
  return JSON.parse(data);
};

export const saveChallenges = (challenges: Challenge[]) => {
  localStorage.setItem('lq_challenges', JSON.stringify(challenges));
};