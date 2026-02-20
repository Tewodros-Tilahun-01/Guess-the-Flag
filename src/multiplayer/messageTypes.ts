import { GameMessage } from '../types/messages';

export const serializeMessage = (message: GameMessage): string => {
  return JSON.stringify(message);
};

export const deserializeMessage = (data: string): GameMessage => {
  return JSON.parse(data);
};
