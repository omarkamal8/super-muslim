import { StyleSheet, TouchableOpacity, View as RNView, Alert, ScrollView, Image, Switch, useColorScheme } from 'react-native';
import { View, Text } from '../../components/Themed';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LanguageSelector from '../../components/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const PRAYER_NOTIFICATIONS_KEY = 'prayer_notifications_enabled';

export default function SettingsScreen() {
  const [prayerNotifications, setPrayerNotifications] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    checkPermissions();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notificationsEnabled = await AsyncStorage.getItem(PRAYER_NOTIFICATIONS_KEY);
      setPrayerNotifications(notificationsEnabled === 'true');
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setIsLoading(false);
    }
  };

  const checkPermissions = async () => {
    // Check location permission
    const { status: locationStatus } = await Location.getForegroundPermissionsAsync();
    setLocationPermissionStatus(locationStatus);

    // Check notification permission
    const { status: notificationStatus } = await Notifications.getPermissionsAsync();
    setNotificationPermissionStatus(notificationStatus);
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermissionStatus(status);
    return status;
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotificationPermissionStatus(status);
    return status;
  };

  const togglePrayerNotifications = async () => {
    try {
      // If turning on notifications, check permissions
      if (!prayerNotifications) {
        // Check location permission first
        let locationStatus = locationPermissionStatus;
        if (locationStatus !== 'granted') {
          locationStatus = await requestLocationPermission();
          if (locationStatus !== 'granted') {
            Alert.alert(
              'Location Permission Required',
              'Prayer time notifications require location access to calculate accurate prayer times for your area.',
              [{ text: 'OK' }]
            );
            return;
          }
        }

        // Then check notification permission
        let notificationStatus = notificationPermissionStatus;
        if (notificationStatus !== 'granted') {
          notificationStatus = await requestNotificationPermission();
          if (notificationStatus !== 'granted') {
            Alert.alert(
              'Notification Permission Required',
              'Please enable notifications to receive prayer time alerts.',
              [{ text: 'OK' }]
            );
            return;
          }
        }

        // Schedule prayer notifications
        await schedulePrayerNotifications();
      } else {
        // Cancel all scheduled notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
      }

      // Update state and save setting
      const newValue = !prayerNotifications;
      setPrayerNotifications(newValue);
      await AsyncStorage.setItem(PRAYER_NOTIFICATIONS_KEY, newValue.toString());
    } catch (error) {
      console.error('Error toggling prayer notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    }
  };

  const schedulePrayerNotifications = async () => {
    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Fetch prayer times
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        // Cancel any existing notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // Schedule notifications for each prayer time
        const prayerTimes = data.data.timings;
        const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        for (const prayer of prayerNames) {
          const time = prayerTimes[prayer];
          const [hours, minutes] = time.split(':').map(Number);
          
          // Create a date object for this prayer time
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0);
          
          // If the prayer time has already passed today, schedule for tomorrow
          if (prayerDate < new Date()) {
            prayerDate.setDate(prayerDate.getDate() + 1);
          }
          
          // Schedule the notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `${prayer} Prayer Time`,
              body: `It's time for ${prayer} prayer`,
              sound: true,
            },
            trigger: {
              hour: hours,
              minute: minutes,
              repeats: true,
            },
          });
        }
        
        Alert.alert('Success', 'Prayer time notifications have been scheduled.');
      } else {
        throw new Error('Failed to fetch prayer times');
      }
    } catch (error) {
      console.error('Error scheduling prayer notifications:', error);
      Alert.alert('Error', 'Failed to schedule prayer notifications. Please try again.');
      throw error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['#1DB954', '#121212'] : ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800' }}
          style={styles.headerImage}
          blurRadius={2}
        />
        <View style={[styles.headerOverlay, { backgroundColor: 'transparent' }]}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your app experience</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Language</Text>
          
          <TouchableOpacity
            style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}
            onPress={() => setIsLanguageModalVisible(true)}
          >
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="language" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>App Language</Text>
                <Text style={styles.settingDescription}>{currentLanguage.name} ({currentLanguage.nativeName})</Text>
              </RNView>
            </RNView>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#B3B3B3' : '#666666'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Notifications</Text>
          
          <View style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="notifications" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Prayer Time Alerts</Text>
                <Text style={styles.settingDescription}>Receive notifications for daily prayer times</Text>
              </RNView>
            </RNView>
            <Switch
              value={prayerNotifications}
              onValueChange={togglePrayerNotifications}
              trackColor={{ false: isDark ? '#555555' : '#D1D5DB', true: '#1DB954' }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              disabled={isLoading}
            />
          </View>

          {locationPermissionStatus !== 'granted' && (
            <View style={[styles.permissionWarning, { backgroundColor: isDark ? '#3A2A22' : '#FFF4E5' }]}>
              <Ionicons name="warning" size={20} color="#FF9800" />
              <Text style={[styles.permissionWarningText, { color: isDark ? '#FFB74D' : '#E65100' }]}>
                Location permission is required for accurate prayer times
              </Text>
            </View>
          )}

          {notificationPermissionStatus !== 'granted' && (
            <View style={[styles.permissionWarning, { backgroundColor: isDark ? '#3A2A22' : '#FFF4E5' }]}>
              <Ionicons name="warning" size={20} color="#FF9800" />
              <Text style={[styles.permissionWarningText, { color: isDark ? '#FFB74D' : '#E65100' }]}>
                Notification permission is required for prayer alerts
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: 'transparent' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>About</Text>
          
          <TouchableOpacity style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="information-circle" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>About Super Muslim</Text>
                <Text style={styles.settingDescription}>Learn more about the app</Text>
              </RNView>
            </RNView>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#B3B3B3' : '#666666'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="star" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Rate the App</Text>
                <Text style={styles.settingDescription}>If you enjoy using Super Muslim, please rate it</Text>
              </RNView>
            </RNView>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#B3B3B3' : '#666666'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="mail" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Contact Support</Text>
                <Text style={styles.settingDescription}>Get help or send feedback</Text>
              </RNView>
            </RNView>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#B3B3B3' : '#666666'} />
          </TouchableOpacity>

          <View style={[styles.settingCard, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
            <RNView style={styles.settingInfo}>
              <RNView style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
                <Ionicons name="code" size={24} color="#FFFFFF" />
              </RNView>
              <RNView style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>Version</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </RNView>
            </RNView>
          </View>
        </View>
      </ScrollView>

      <LanguageSelector
        isVisible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
      />
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
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 8,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  permissionWarningText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});