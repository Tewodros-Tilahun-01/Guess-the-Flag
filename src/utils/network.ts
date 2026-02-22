import NetInfo from '@react-native-community/netinfo';
import { NetworkInfo } from 'react-native-network-info';

export const getLocalIpAddress = async (): Promise<string> => {
  try {
    // Try react-native-network-info first (works with both WiFi and cellular)
    const ip = await NetworkInfo.getIPV4Address();
    console.log('NetworkInfo IP:', ip);
    if (ip && ip !== '0.0.0.0') {
      return ip;
    }

    // Fallback to NetInfo
    const state = await NetInfo.fetch();
    console.log('Network state:', JSON.stringify(state, null, 2));

    // Get IP address from network state
    if (
      state.details &&
      'ipAddress' in state.details &&
      state.details.ipAddress
    ) {
      const ipAddress = state.details.ipAddress as string;
      if (ipAddress && ipAddress !== '0.0.0.0') {
        return ipAddress;
      }
    }

    // Fallback for different network types
    if (state.type === 'wifi' && state.details) {
      const details = state.details as any;
      if (details.ipAddress) {
        return details.ipAddress;
      }
    }

    return '0.0.0.0';
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
