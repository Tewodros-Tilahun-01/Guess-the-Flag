export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
