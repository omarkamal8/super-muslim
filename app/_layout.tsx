import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </LanguageProvider>
  );
}