export interface Country {
  id: number;
  name: string;
  region: string;
  difficulty: number;
  flag_file: string;
}

export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

export interface GameConfig {
  questionsCount: number;
  timePerQuestion: number;
  difficultyLevels: number[]; // Array of selected difficulty levels (1-5)
}

export interface Question {
  country: Country;
  questionIndex: number;
}

export interface Answer {
  questionIndex: number;
  playerId: string;
  playerName: string;
  answer: string;
  correctAnswer: string;
  isCorrect: boolean;
  flagFile: string;
}

export interface PlayerAnswers {
  playerId: string;
  playerName: string;
  answers: Answer[];
}

export type GameMode = 'single' | 'multiplayer';
export type GameState = 'menu' | 'lobby' | 'playing' | 'ended';

export interface GameStore {
  gameMode: GameMode | null;
  gameState: GameState;
  isHost: boolean;
  playerId: string;
  playerName: string;
  players: Player[];
  gameConfig: GameConfig;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  playerAnswers: PlayerAnswers[]; // Array of player answers
  timeRemaining: number;
  playerLeftNotification: string | null;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setGameState: (state: GameState) => void;
  setIsHost: (isHost: boolean) => void;
  setPlayerName: (name: string) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setPlayers: (players: Player[]) => void;
  setGameConfig: (config: GameConfig) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  addPlayerAnswer: (
    playerId: string,
    playerName: string,
    answer: Answer,
  ) => void;
  setPlayerAnswers: (playerAnswers: PlayerAnswers[]) => void;
  setTimeRemaining: (time: number) => void;
  setPlayerLeftNotification: (playerName: string | null) => void;
  resetGame: () => void;
  resetGameState: () => void; // Partial reset for play again
}
