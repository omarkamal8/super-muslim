import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AudioPlayerProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
          <GlobalAudioPlayer />
        </View>
      </AudioPlayerProvider>
    </LanguageProvider>
  );
}