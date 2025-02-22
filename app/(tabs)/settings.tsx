import { StyleSheet, Switch, TouchableOpacity, View as RNView } from 'react-native';
import { View, Text } from '../../components/Themed';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import LanguageSelector from '../../components/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const { currentLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setIsLanguageModalVisible(true)}
        >
          <RNView style={styles.languageInfo}>
            <Ionicons name="language" size={24} color="#2E8B57" />
            <RNView style={styles.languageTexts}>
              <Text style={styles.languageName}>{currentLanguage.name}</Text>
              <Text style={styles.nativeName}>{currentLanguage.nativeName}</Text>
            </RNView>
          </RNView>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>Prayer Time Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? '#2E8B57' : '#f4f3f4'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Ionicons name="play-circle" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>Auto-play Audio</Text>
          </View>
          <Switch
            value={autoPlayAudio}
            onValueChange={setAutoPlayAudio}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={autoPlayAudio ? '#2E8B57' : '#f4f3f4'}
          />
        </View>

        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#2E8B57' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>About this App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="star" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>Rate the App</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="mail" size={24} color="#2E8B57" />
            <Text style={styles.settingText}>Contact Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageTexts: {
    marginLeft: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});