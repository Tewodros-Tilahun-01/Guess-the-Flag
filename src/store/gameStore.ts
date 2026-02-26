import { create } from 'zustand';
import { GameStore } from '../types/game';

const initialState = {
  gameMode: null,
  gameState: 'menu' as const,
  isHost: false,
  playerId: '',
  playerName: '',
  players: [],
  gameConfig: {
    questionsCount: 10,
    timePerQuestion: 30,
    difficultyLevels: [1, 2, 3, 4, 5],
  },
  currentQuestion: null,
  currentQuestionIndex: 0,
  playerAnswers: [],
  timeRemaining: 0,
  playerLeftNotification: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setGameMode: (mode) => set({ gameMode: mode }),
  setGameState: (state) => set({ gameState: state }),
  setIsHost: (isHost) => set({ isHost }),
  setPlayerName: (name) => set({ playerName: name }),

  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  updatePlayer: (playerId, updates) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p,
      ),
    })),

  setPlayers: (players) => set({ players }),
  setGameConfig: (config) => set({ gameConfig: config }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  addPlayerAnswer: (playerId, playerName, answer) =>
    set((state) => {
      const existingPlayer = state.playerAnswers.find(
        (p) => p.playerId === playerId,
      );

      if (existingPlayer) {
        // Update existing player's answers
        return {
          playerAnswers: state.playerAnswers.map((p) =>
            p.playerId === playerId
              ? { ...p, answers: [...p.answers, answer] }
              : p,
          ),
        };
      } else {
        // Add new player with first answer
        return {
          playerAnswers: [
            ...state.playerAnswers,
            {
              playerId,
              playerName,
              answers: [answer],
            },
          ],
        };
      }
    }),

  setPlayerAnswers: (playerAnswers) => set({ playerAnswers }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setPlayerLeftNotification: (playerName) =>
    set({ playerLeftNotification: playerName }),

  resetGame: () => set(initialState),

  // Partial reset - keeps connection and player info for "Play Again"
  resetGameState: () =>
    set({
      gameState: 'lobby',
      currentQuestion: null,
      currentQuestionIndex: 0,
      playerAnswers: [],
      timeRemaining: 0,
      playerLeftNotification: null,
    }),
}));
