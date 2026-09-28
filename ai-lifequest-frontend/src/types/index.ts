export type ChallengeStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface Challenge {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  xpReward: number;
  status: ChallengeStatus;
  completedAt?: string; // 👈 Campo opcional de fecha de finalización
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  progressPercentage: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface User {
  id: string;
  name: string;
  email: string;
  totalXp: number;
}