import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGameStore } from '../src/store/gameStore';
import { setMultiplayerConnection } from '../src/utils/connectionManager';
import { generatePlayerId } from '../src/utils/generateId';
import { createMultiplayerConnection } from '../src/utils/multiplayerConnection';

export default function JoinGame() {
  const router = useRouter();
  const {
    setPlayerName,
    setPlayers,
    setGameConfig,
    setCurrentQuestion,
    setTimeRemaining,
    setGameState,
  } = useGameStore();
  const [name, setName] = useState('Player');
  const [connecting, setConnecting] = useState(false);
  const [manualIp, setManualIp] = useState('');
  const [manualPort, setManualPort] = useState('8080');
  const [showScanner, setShowScanner] = useState(false);
  const [mode, setMode] = useState<'qr' | 'manual'>('qr'); // 'qr' or 'manual'
  const [permission, requestPermission] = useCameraPermissions();

  const handleQRScan = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to scan QR codes',
        );
        return;
      }
    }

    setShowScanner(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.ip && qrData.port) {
        setShowScanner(false);
        setManualIp(qrData.ip);
        setManualPort(qrData.port);
        // Auto-connect after scanning
        setTimeout(() => {
          connectToHost(qrData.ip, parseInt(qrData.port, 10));
        }, 300);
      } else {
        Alert.alert('Invalid QR Code', 'This QR code is not valid');
      }
    } catch (error) {
      Alert.alert('Invalid QR Code', 'Could not read QR code data');
    }
  };

  const handleManualConnect = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!manualIp.trim()) {
      Alert.alert('Error', 'Please enter the host IP address');
      return;
    }

    const portNum = parseInt(manualPort, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      Alert.alert('Error', 'Please enter a valid port number (1-65535)');
      return;
    }

    await connectToHost(manualIp.trim(), portNum);
  };

  const connectToHost = async (ip: string, portNum: number) => {
    setConnecting(true);

    // Generate unique player ID
    const playerId = generatePlayerId();

    setPlayerName(name);

    // Store the player ID in the game store
    useGameStore.setState({ playerId });

    // Use shared connection utility
    const connection = createMultiplayerConnection(
      router,
      setPlayers,
      setGameConfig,
      setGameState,
      setCurrentQuestion,
      setTimeRemaining,
      useGameStore.getState().setPlayerLeftNotification,
    );

    try {
      await connection.connect(ip, portNum, playerId, name);
      // Set global connection reference for game screen
      setMultiplayerConnection(connection);
      router.push('/lobby' as any);
    } catch (error) {
      Alert.alert('Connection Failed', 'Could not connect to host');
      setConnecting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F59E0B', '#F97316', '#EF4444']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Game</Text>
          <Text style={styles.subtitle}>Choose how to connect</Text>
        </View>

        {/* Name Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>👤 Your Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.cardInput}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setMode('qr')}
            style={[styles.tab, mode === 'qr' && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabIcon, mode === 'qr' && styles.tabIconActive]}
            >
              📷
            </Text>
            <Text
              style={[styles.tabText, mode === 'qr' && styles.tabTextActive]}
            >
              Scan QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('manual')}
            style={[styles.tab, mode === 'manual' && styles.tabActive]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabIcon,
                mode === 'manual' && styles.tabIconActive,
              ]}
            >
              ⌨️
            </Text>
            <Text
              style={[
                styles.tabText,
                mode === 'manual' && styles.tabTextActive,
              ]}
            >
              Enter IP
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {mode === 'qr' ? (
            <View style={styles.qrContent}>
              <Text style={styles.contentTitle}>Scan QR Code</Text>
              <Text style={styles.contentDescription}>
                Ask the host to show their QR code, then tap the button below to
                scan
              </Text>
              <TouchableOpacity
                onPress={handleQRScan}
                style={styles.primaryButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Open Camera</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.manualContent}>
              <Text style={styles.contentTitle}>Enter Connection Info</Text>
              <Text style={styles.contentDescription}>
                Get the IP address and port from the host
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>IP Address</Text>
                <TextInput
                  value={manualIp}
                  onChangeText={setManualIp}
                  style={styles.formInput}
                  placeholder="192.168.1.100"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Port</Text>
                <TextInput
                  value={manualPort}
                  onChangeText={setManualPort}
                  style={styles.formInput}
                  placeholder="8080"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                onPress={handleManualConnect}
                disabled={connecting}
                style={styles.primaryButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    connecting ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {connecting ? 'Connecting...' : 'Connect'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <Text style={styles.scannerTitle}>Scan QR Code</Text>
              <TouchableOpacity
                onPress={() => setShowScanner(false)}
                style={styles.scannerCloseButton}
              >
                <Text style={styles.scannerCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scannerFrame}>
              <View style={styles.scannerCorner} />
            </View>
            <Text style={styles.scannerHint}>
              Point your camera at the QR code
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  cardInput: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIcon: {
    fontSize: 20,
    marginRight: 6,
    opacity: 0.7,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tabTextActive: {
    color: '#F97316',
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  qrContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconCircleEmoji: {
    fontSize: 40,
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  contentDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scannerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerCloseText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scannerFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerCorner: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 24,
  },
  scannerHint: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
});
