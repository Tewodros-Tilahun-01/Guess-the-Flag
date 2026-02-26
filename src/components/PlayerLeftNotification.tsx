import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from '../store/gameStore';

export const PlayerLeftNotification = () => {
  const { playerLeftNotification, setPlayerLeftNotification } = useGameStore();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (playerLeftNotification) {
      // Slide in and fade in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 18,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after 4 seconds
      const timeout = setTimeout(() => {
        // Slide out and fade out
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setPlayerLeftNotification(null);
          slideAnim.setValue(-100);
          fadeAnim.setValue(0);
        });
      }, 4000);

      return () => clearTimeout(timeout);
    }
  }, [playerLeftNotification]);

  if (!playerLeftNotification) return null;

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.notificationWrapper}>
        <LinearGradient
          colors={['#FBBF24', '#F59E0B', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.notification}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationEmoji}>👋</Text>
            </View>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle}>Player Left</Text>
              <Text style={styles.notificationMessage}>
                {playerLeftNotification} has left the game
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notificationWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  notification: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationEmoji: {
    fontSize: 24,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  notificationMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 18,
  },
});
