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
  answers: [],
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
  addAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setPlayerLeftNotification: (playerName) =>
    set({ playerLeftNotification: playerName }),

  resetGame: () => set(initialState),
}));
