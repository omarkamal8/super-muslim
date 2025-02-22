import { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { View, Text } from '../../components/Themed';
import * as Location from 'expo-location';

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export default function PrayerTimesScreen() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission not granted');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
      } else {
        setError('Failed to load prayer times');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prayer Times</Text>
        <Text style={styles.headerSubtitle}>Today's Prayer Schedule</Text>
      </View>
      
      {prayerTimes && (
        <View style={styles.timesContainer}>
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Fajr</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Fajr}</Text>
          </View>
          
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Sunrise</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Sunrise}</Text>
          </View>
          
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Dhuhr</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Dhuhr}</Text>
          </View>
          
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Asr</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Asr}</Text>
          </View>
          
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Maghrib</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Maghrib}</Text>
          </View>
          
          <View style={styles.prayerCard}>
            <Text style={styles.prayerName}>Isha</Text>
            <Text style={styles.prayerTime}>{prayerTimes.Isha}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#2E8B57',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  timesContainer: {
    padding: 16,
  },
  prayerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E8B57',
  },
  prayerTime: {
    fontSize: 24,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});