import TcpSocket from 'react-native-tcp-socket';
import { getLocalIpAddress } from '../utils/network';

export interface DiscoveredHost {
  name: string;
  address: string;
  port: number;
  playerCount: number;
}

// Simple discovery using TCP port scanning on common subnet
export class HostDiscoveryService {
  private scanInterval: ReturnType<typeof setInterval> | null = null;
  private onHostsUpdated: (hosts: DiscoveredHost[]) => void;
  private discoveredHosts: Map<string, DiscoveredHost & { lastSeen: number }> =
    new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private isScanning: boolean = false;

  constructor(onHostsUpdated: (hosts: DiscoveredHost[]) => void) {
    this.onHostsUpdated = onHostsUpdated;
  }

  startDiscovery(port: number = 8081): void {
    console.log('Starting host discovery...');

    // Scan for hosts periodically
    this.scanInterval = setInterval(() => {
      this.scanForHosts(port);
    }, 5000);

    // Clean up stale hosts
    this.cleanupInterval = setInterval(() => {
      this.cleanupStaleHosts();
    }, 10000);

    // Initial scan
    this.scanForHosts(port);
  }

  private async scanForHosts(port: number): Promise<void> {
    if (this.isScanning) return;
    this.isScanning = true;

    try {
      // Get local IP to determine subnet
      const localIp = await getLocalIpAddress();
      if (!localIp || localIp === '0.0.0.0') {
        console.log('Could not determine local IP for scanning');
        this.isScanning = false;
        return;
      }

      // Extract subnet (e.g., 192.168.1.x)
      const subnet = localIp.substring(0, localIp.lastIndexOf('.'));

      // Scan common IP addresses (last octet 1-254)
      // For performance, we'll only scan a subset
      const ipsToScan = [1, 100, 101, 102, 103, 104, 105, 254]; // Common router and device IPs

      for (const lastOctet of ipsToScan) {
        const ip = `${subnet}.${lastOctet}`;
        if (ip === localIp) continue; // Skip self

        this.tryConnectToHost(ip, port);
      }
    } catch (error) {
      console.error('Error scanning for hosts:', error);
    } finally {
      this.isScanning = false;
    }
  }

  private tryConnectToHost(ip: string, port: number): void {
    try {
      const socket = TcpSocket.createConnection(
        {
          host: ip,
          port,
        },
        () => {
          // Connected! Request host info
          const request = JSON.stringify({ type: 'GET_HOST_INFO' });
          socket.write(request);
        },
      );

      // Set timeout manually
      const timeoutId = setTimeout(() => {
        socket.destroy();
      }, 1000);

      socket.on('data', (data: string | Buffer) => {
        try {
          const dataStr = typeof data === 'string' ? data : data.toString();
          const message = JSON.parse(dataStr);
          if (message.type === 'HOST_INFO') {
            this.handleHostFound(message.payload);
          }
        } catch (error) {
          console.error('Error parsing host info:', error);
        }
        clearTimeout(timeoutId);
        socket.destroy();
      });

      socket.on('error', () => {
        // Host not found or not responding - silently ignore
        clearTimeout(timeoutId);
        socket.destroy();
      });

      socket.on('close', () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      // Ignore connection errors during scanning
    }
  }

  private handleHostFound(payload: DiscoveredHost): void {
    const key = `${payload.address}:${payload.port}`;
    this.discoveredHosts.set(key, {
      ...payload,
      lastSeen: Date.now(),
    });

    this.notifyHostsUpdated();
  }

  private cleanupStaleHosts(): void {
    const now = Date.now();
    const staleThreshold = 30000; // 30 seconds

    for (const [key, host] of this.discoveredHosts.entries()) {
      if (now - host.lastSeen > staleThreshold) {
        this.discoveredHosts.delete(key);
      }
    }

    this.notifyHostsUpdated();
  }

  private notifyHostsUpdated(): void {
    const hosts = Array.from(this.discoveredHosts.values()).map(
      ({ lastSeen, ...host }) => host,
    );
    this.onHostsUpdated(hosts);
  }

  stopDiscovery(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    this.discoveredHosts.clear();
  }
}

export class HostAnnouncer {
  private announcementServer: any = null;
  private hostInfo: DiscoveredHost;

  constructor(hostInfo: DiscoveredHost) {
    this.hostInfo = hostInfo;
  }

  startAnnouncing(port: number = 8081): void {
    // Create TCP server for discovery requests
    this.announcementServer = TcpSocket.createServer((socket: any) => {
      socket.on('data', (data: string | Buffer) => {
        try {
          const dataStr = typeof data === 'string' ? data : data.toString();
          const message = JSON.parse(dataStr);
          if (message.type === 'GET_HOST_INFO') {
            this.sendHostInfo(socket);
          }
        } catch (error) {
          console.error('Error handling discovery request:', error);
        }
      });

      socket.on('error', (error: Error) => {
        console.error('Announcement socket error:', error);
      });
    });

    if (!this.announcementServer) {
      throw new Error(
        'Failed to create announcement server. TCP socket creation returned null.',
      );
    }

    this.announcementServer.listen({ port, host: '0.0.0.0' }, () => {
      console.log(`✅ Announcement service listening on port ${port}`);
    });

    this.announcementServer.on('error', (error: Error) => {
      console.error('Announcement server error:', error);
      // Don't throw, just log - the game server is still working
    });
  }

  private sendHostInfo(socket: any): void {
    try {
      const message = JSON.stringify({
        type: 'HOST_INFO',
        payload: this.hostInfo,
      });
      socket.write(message);
    } catch (error) {
      console.error('Error sending host info:', error);
    }
  }

  updatePlayerCount(count: number): void {
    this.hostInfo.playerCount = count;
  }

  stopAnnouncing(): Promise<void> {
    return new Promise((resolve) => {
      if (this.announcementServer) {
        try {
          this.announcementServer.close(() => {
            console.log('Announcement server closed successfully');
            this.announcementServer = null;
            resolve();
          });
        } catch (error) {
          console.error('Error closing announcement server:', error);
          this.announcementServer = null;
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
}
