import { GameMessage } from '../types/messages';

// Message delimiter
const MESSAGE_DELIMITER = '\n';

export const serializeMessage = (message: GameMessage): string => {
  return JSON.stringify(message) + MESSAGE_DELIMITER;
};

export const deserializeMessage = (data: string): GameMessage => {
  // Remove delimiter if present
  const cleanData = data.trim();
  return JSON.parse(cleanData);
};
