import { Answer } from '../types/game';

export const calculateScore = (answers: Answer[]): number => {
  if (answers.length === 0) return 0;

  const correctCount = answers.filter((a) => a.isCorrect).length;
  return Math.round((correctCount / answers.length) * 100);
};

export const getPlayerScore = (answers: Answer[], playerId: string): number => {
  const playerAnswers = answers.filter((a) => a.playerId === playerId);
  return calculateScore(playerAnswers);
};

export const getLeaderboard = (
  answers: Answer[],
): Array<{
  playerName: string;
  score: number;
  correct: number;
  total: number;
}> => {
  const playerMap = new Map<string, Answer[]>();

  answers.forEach((answer) => {
    const existing = playerMap.get(answer.playerName) || [];
    playerMap.set(answer.playerName, [...existing, answer]);
  });

  const leaderboard = Array.from(playerMap.entries()).map(
    ([playerName, playerAnswers]) => {
      const correct = playerAnswers.filter((a) => a.isCorrect).length;
      const total = playerAnswers.length;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;

      return { playerName, score, correct, total };
    },
  );

  return leaderboard.sort((a, b) => b.score - a.score);
};
