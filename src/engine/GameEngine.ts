import { getRandomCountries } from '../database/countryQueries';
import { Answer, Country, Question } from '../types/game';

export class GameEngine {
  private questions: Country[] = [];
  private currentIndex: number = 0;

  async generateQuestions(
    count: number,
    difficultyLevels?: number[],
  ): Promise<void> {
    this.questions = await getRandomCountries(count, difficultyLevels);
    this.currentIndex = 0;
  }

  getCurrentQuestion(): Question | null {
    if (this.currentIndex >= this.questions.length) return null;

    return {
      country: this.questions[this.currentIndex],
      questionIndex: this.currentIndex,
    };
  }

  nextQuestion(): Question | null {
    this.currentIndex++;
    return this.getCurrentQuestion();
  }

  isGameEnded(): boolean {
    return this.currentIndex >= this.questions.length;
  }

  checkAnswer(answer: string, correctAnswer: string): boolean {
    return answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }

  createAnswer(
    questionIndex: number,
    playerId: string,
    playerName: string,
    answer: string,
    correctAnswer: string,
    flagFile: string,
  ): Answer {
    return {
      questionIndex,
      playerId,
      playerName,
      answer,
      correctAnswer,
      isCorrect: this.checkAnswer(answer, correctAnswer),
      flagFile,
    };
  }

  reset(): void {
    this.questions = [];
    this.currentIndex = 0;
  }
}
