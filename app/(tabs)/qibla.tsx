import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { View, Text } from '../../components/Themed';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const MECCA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

// Ka'ba icon SVG path
const KaabaIcon = ({ color }: { color: string }) => (
  <G>
    {/* Base structure */}
    <Path
      d="M-15 0 L15 0 L15 -30 L-15 -30 Z"
      fill={color}
      stroke={color}
      strokeWidth="2"
    />
    {/* Door */}
    <Path
      d="M-5 0 L5 0 L5 -15 L-5 -15 Z"
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
    {/* Kiswah pattern */}
    <Path
      d="M-15 -10 L15 -10 M-15 -20 L15 -20"
      stroke={color}
      strokeWidth="1"
      opacity="0.5"
    />
  </G>
);

export default function QiblaScreen() {
  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setupSensors();
    return () => {
      cleanup();
    };
  }, []);

  const setupSensors = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required for Qibla direction');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (Platform.OS === 'web') {
        setError('Compass functionality is not available on web browsers');
        return;
      }

      Magnetometer.setUpdateInterval(100);
      const subscription = Magnetometer.addListener(data => {
        let angle = Math.atan2(data.y, data.x);
        angle = angle * (180 / Math.PI);
        if (angle < 0) {
          angle = 360 + angle;
        }
        setMagnetometer(angle);
      });

      setSubscription(subscription);

      // Calculate Qibla direction
      if (location) {
        const qiblaAngle = calculateQiblaDirection(
          location.coords.latitude,
          location.coords.longitude
        );
        setQiblaDirection(qiblaAngle);
      }
    } catch (err) {
      setError('Error initializing sensors');
    }
  };

  const cleanup = () => {
    if (subscription) {
      subscription.remove();
    }
  };

  const calculateQiblaDirection = (latitude: number, longitude: number) => {
    const φ1 = latitude * (Math.PI / 180);
    const φ2 = MECCA_COORDS.latitude * (Math.PI / 180);
    const Δλ = (MECCA_COORDS.longitude - longitude) * (Math.PI / 180);

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);

    if (qiblaAngle < 0) {
      qiblaAngle = 360 + qiblaAngle;
    }

    return qiblaAngle;
  };

  const compassRotation = magnetometer;
  const qiblaRotation = qiblaDirection - compassRotation;

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const accentColor = '#1DB954';

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: '#FF4444' }]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={setupSensors}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <LinearGradient
        colors={isDark ? ['#1DB954', '#121212'] : ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <View style={[styles.headerContent, { backgroundColor: 'transparent' }]}>
          <Text style={styles.headerTitle}>Qibla Finder</Text>
          <Text style={styles.headerSubtitle}>Point your phone towards Qibla</Text>
        </View>
      </LinearGradient>

      <View style={[styles.compassContainer, { backgroundColor: 'transparent' }]}>
        <Svg height="300" width="300" style={{ transform: [{ rotate: `${compassRotation}deg` }] }}>
          {/* Compass Rose */}
          <Circle cx="150" cy="150" r="145" stroke={isDark ? '#333' : '#EEE'} strokeWidth="1" fill="none" />
          <Circle cx="150" cy="150" r="140" stroke={isDark ? '#444' : '#F5F5F5'} strokeWidth="10" fill="none" />
          
          {/* Cardinal Directions */}
          <Line x1="150" y1="20" x2="150" y2="40" stroke={accentColor} strokeWidth="2" />
          <Line x1="150" y1="260" x2="150" y2="280" stroke={isDark ? '#666' : '#CCC'} strokeWidth="2" />
          <Line x1="20" y1="150" x2="40" y2="150" stroke={isDark ? '#666' : '#CCC'} strokeWidth="2" />
          <Line x1="260" y1="150" x2="280" y2="150" stroke={isDark ? '#666' : '#CCC'} strokeWidth="2" />
          
          {/* Direction Letters */}
          <Text x="145" y="30" fill={accentColor} fontSize="16" textAnchor="middle">N</Text>
          <Text x="145" y="280" fill={isDark ? '#666' : '#CCC'} fontSize="16" textAnchor="middle">S</Text>
          <Text x="30" y="155" fill={isDark ? '#666' : '#CCC'} fontSize="16" textAnchor="middle">W</Text>
          <Text x="270" y="155" fill={isDark ? '#666' : '#CCC'} fontSize="16" textAnchor="middle">E</Text>
        </Svg>

        {/* Qibla Direction Indicator with Ka'ba */}
        <View style={[styles.qiblaIndicator, { transform: [{ rotate: `${qiblaRotation}deg` }] }]}>
          <Svg height="60" width="60" style={styles.kaabaIcon}>
            <G transform="translate(30, 45)">
              <KaabaIcon color={accentColor} />
            </G>
          </Svg>
        </View>
      </View>

      <View style={[styles.infoContainer, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
        <Text style={[styles.infoText, { color: textColor }]}>
          Qibla is {Math.round(qiblaDirection)}° from North
        </Text>
        {location && (
          <Text style={[styles.coordinatesText, { color: isDark ? '#B3B3B3' : '#666' }]}>
            Your location: {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    width: '100%',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    position: 'relative',
  },
  qiblaIndicator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaabaIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});