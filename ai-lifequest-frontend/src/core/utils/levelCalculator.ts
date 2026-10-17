export interface LevelData {
  level: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercentage: number;
  totalXp: number;
}

export function calculateLevelData(totalXp: number): LevelData {
  let level = 1;
  let requiredForNext = 100 * level;
  let accumulatedXp = 0;

  // Determinar nivel y XP acumulada previa
  while (totalXp >= accumulatedXp + requiredForNext) {
    accumulatedXp += requiredForNext;
    level++;
    requiredForNext = 100 * level;
  }

  const xpInCurrentLevel = totalXp - accumulatedXp;
  const progressPercentage = Math.min(
    100,
    Math.round((xpInCurrentLevel / requiredForNext) * 100)
  );

  return {
    level,
    xpInCurrentLevel,
    xpRequiredForNextLevel: requiredForNext,
    progressPercentage,
    totalXp,
  };
}