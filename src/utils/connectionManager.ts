import { ClientConnection } from '../multiplayer/ClientConnection';

// Global reference to the active multiplayer connection
let multiplayerConnection: ClientConnection | null = null;

export const setMultiplayerConnection = (
  connection: ClientConnection | null,
) => {
  multiplayerConnection = connection;
};

export const getMultiplayerConnection = () => multiplayerConnection;

export const clearMultiplayerConnection = () => {
  if (multiplayerConnection) {
    multiplayerConnection.disconnect();
    multiplayerConnection = null;
  }
};
