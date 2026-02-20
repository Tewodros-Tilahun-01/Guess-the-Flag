// Game Configuration
export const DEFAULT_QUESTIONS_COUNT = 10;
export const DEFAULT_TIME_PER_QUESTION = 30; // seconds
export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 50;
export const MIN_TIME = 10;
export const MAX_TIME = 120;

// Network Configuration
export const DEFAULT_PORT = 8080;
export const DEFAULT_HOST = '0.0.0.0';

// Game States
export const GAME_STATES = {
  MENU: 'menu',
  LOBBY: 'lobby',
  PLAYING: 'playing',
  ENDED: 'ended',
} as const;

// Game Modes
export const GAME_MODES = {
  SINGLE: 'single',
  MULTIPLAYER: 'multiplayer',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  JOIN_GAME: 'JOIN_GAME',
  PLAYER_LIST_UPDATE: 'PLAYER_LIST_UPDATE',
  PLAYER_READY: 'PLAYER_READY',
  GAME_CONFIG: 'GAME_CONFIG',
  GAME_START: 'GAME_START',
  NEW_QUESTION: 'NEW_QUESTION',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  GAME_END: 'GAME_END',
  TIME_UPDATE: 'TIME_UPDATE',
} as const;

// Difficulty Levels
export const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
} as const;

// Regions
export const REGIONS = {
  AFRICA: 'Africa',
  AMERICAS: 'Americas',
  ASIA: 'Asia',
  EUROPE: 'Europe',
  OCEANIA: 'Oceania',
} as const;
