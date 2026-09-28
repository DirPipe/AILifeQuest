export type ChallengeStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  totalXp: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  targetDate: string;
  progressPercentage: number;
  status: GoalStatus;
}

export interface Challenge {
  id: string;
  goalId: string;
  title: string;
  description: string;
  xpReward: number;
  status: ChallengeStatus;
}