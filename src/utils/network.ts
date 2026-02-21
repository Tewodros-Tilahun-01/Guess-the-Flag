import NetInfo from '@react-native-community/netinfo';
import TcpSocket from 'react-native-tcp-socket';

export const getLocalIpAddress = async (): Promise<string> => {
  try {
    // First try NetInfo
    const state = await NetInfo.fetch();
    console.log('Network state:', JSON.stringify(state, null, 2));
    // Get IP address from network state
    if (
      state.details &&
      'ipAddress' in state.details &&
      state.details.ipAddress
    ) {
      const ip = state.details.ipAddress as string;
      if (ip && ip !== '0.0.0.0') {
        return ip;
      }
    }

    // Fallback for different network types
    if (state.type === 'wifi' && state.details) {
      const details = state.details as any;
      if (details.ipAddress) {
        return details.ipAddress;
      }
    }

    // Alternative method: Create a temporary socket to discover local IP
    return new Promise((resolve) => {
      const socket = TcpSocket.createConnection(
        {
          port: 80,
          host: '8.8.8.8', // Google DNS
        },
        () => {
          const address = socket.address();
          socket.destroy();
          if (
            address &&
            typeof address === 'object' &&
            'address' in address &&
            address.address &&
            address.address !== '0.0.0.0'
          ) {
            resolve(address.address);
          } else {
            resolve('0.0.0.0');
          }
        },
      );

      socket.setTimeout(2000);

      socket.on('error', () => {
        socket.destroy();
        resolve('0.0.0.0');
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve('0.0.0.0');
      });
    });
  } catch (error) {
    console.error('Error getting IP address:', error);
    return '0.0.0.0';
  }
};

export const validateIpAddress = (ip: string): boolean => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

  if (!ipRegex.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

export const DEFAULT_PORT = 8080;
export const DISCOVERY_PORT = 8081;
