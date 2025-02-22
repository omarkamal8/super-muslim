import { Stack } from 'expo-router';

export default function QuranLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="surah/[surahNumber]" 
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
}