import { Answer, GameConfig, Player, Question } from './game';

export type MessageType =
  | 'JOIN_GAME'
  | 'PLAYER_LIST_UPDATE'
  | 'PLAYER_READY'
  | 'GAME_CONFIG'
  | 'GAME_START'
  | 'NEW_QUESTION'
  | 'SUBMIT_ANSWER'
  | 'NEXT_QUESTION'
  | 'GAME_END'
  | 'TIME_UPDATE';

export interface BaseMessage {
  type: MessageType;
}

export interface JoinGameMessage extends BaseMessage {
  type: 'JOIN_GAME';
  payload: {
    playerId: string;
    playerName: string;
  };
}

export interface PlayerListUpdateMessage extends BaseMessage {
  type: 'PLAYER_LIST_UPDATE';
  payload: {
    players: Player[];
  };
}

export interface PlayerReadyMessage extends BaseMessage {
  type: 'PLAYER_READY';
  payload: {
    playerId: string;
    isReady: boolean;
  };
}

export interface GameConfigMessage extends BaseMessage {
  type: 'GAME_CONFIG';
  payload: GameConfig;
}

export interface GameStartMessage extends BaseMessage {
  type: 'GAME_START';
}

export interface NewQuestionMessage extends BaseMessage {
  type: 'NEW_QUESTION';
  payload: Question;
}

export interface SubmitAnswerMessage extends BaseMessage {
  type: 'SUBMIT_ANSWER';
  payload: {
    playerId: string;
    playerName: string;
    answer: string;
  };
}

export interface NextQuestionMessage extends BaseMessage {
  type: 'NEXT_QUESTION';
}

export interface GameEndMessage extends BaseMessage {
  type: 'GAME_END';
  payload: {
    answers: Answer[];
  };
}

export interface TimeUpdateMessage extends BaseMessage {
  type: 'TIME_UPDATE';
  payload: {
    timeRemaining: number;
  };
}

export type GameMessage =
  | JoinGameMessage
  | PlayerListUpdateMessage
  | PlayerReadyMessage
  | GameConfigMessage
  | GameStartMessage
  | NewQuestionMessage
  | SubmitAnswerMessage
  | NextQuestionMessage
  | GameEndMessage
  | TimeUpdateMessage;
