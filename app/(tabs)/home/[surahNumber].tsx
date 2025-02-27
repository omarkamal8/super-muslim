import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
  useColorScheme,
  View as RNView
} from 'react-native';
import { View, Text } from '../../../components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';

type Verse = {
  number: number;
  text: string;
  translation: string;
  transliteration: string;
  audio: string;
};

type SurahDetail = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  verses: Verse[];
};

export default function SurahDetailScreen() {
  const { surahNumber } = useLocalSearchParams();
  const router = useRouter();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showArabicOnly, setShowArabicOnly] = useState(false);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [fullSurahAudioUrl, setFullSurahAudioUrl] = useState<string>('');
  
  // Get the global audio player context
  const { 
    playAudio, 
    pauseAudio, 
    currentAudio, 
    isPlaying,
    autoPlayEnabled
  } = useAudioPlayer();

  // Check if the full surah is currently playing
  const isFullSurahPlaying = currentAudio?.url === fullSurahAudioUrl && fullSurahAudioUrl !== '';

  useEffect(() => {
    initializeAudio();
    fetchSurahDetails();
    return () => {
      cleanupAudio();
    };
  }, [surahNumber]);

  const initializeAudio = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.warn('Error initializing audio:', error);
      }
    }
  };

  const cleanupAudio = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
          webAudioRef.current.src = '';
          webAudioRef.current = null;
        }
      } else if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setPlayingVerse(null);
      setAudioError(null);
    } catch (err) {
      console.warn('Error cleaning up audio:', err);
    }
  };

  const fetchSurahDetails = async () => {
    try {
      const [textResponse, translationResponse, transliterationResponse] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`)
      ]);

      const [textData, translationData, transliterationData] = await Promise.all([
        textResponse.json(),
        translationResponse.json(),
        transliterationResponse.json()
      ]);

      if (
        textData.code === 200 &&
        translationData.code === 200 &&
        transliterationData.code === 200
      ) {
        const verses = textData.data.ayahs.map((ayah: any, index: number) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: translationData.data.ayahs[index].text,
          transliteration: transliterationData.data.ayahs[index].text,
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        }));

        const surahData = {
          number: textData.data.number,
          name: textData.data.name,
          englishName: textData.data.englishName,
          englishNameTranslation: textData.data.englishNameTranslation,
          numberOfAyahs: textData.data.numberOfAyahs,
          revelationType: textData.data.revelationType,
          verses,
        };

        setSurah(surahData);
        // Set the full surah audio URL
        const fullSurahUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${textData.data.number}.mp3`;
        setFullSurahAudioUrl(fullSurahUrl);
        
        // If this surah is already playing in the global player, update the UI
        if (currentAudio?.url === fullSurahUrl) {
          // The full surah is already playing in the global player
        }
      } else {
        setError('Failed to load surah data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const playAudioVerse = async (verse: Verse) => {
    try {
      setAudioError(null);
      await cleanupAudio();

      if (Platform.OS === 'web') {
        const audio = new Audio();
        audio.src = verse.audio;
        audio.onerror = () => {
          console.warn('Web audio error:', audio.error);
          setAudioError('Failed to play audio. Please try again.');
          setPlayingVerse(null);
        };
        audio.onended = () => {
          setPlayingVerse(null);
        };
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            webAudioRef.current = audio;
            setPlayingVerse(verse.number);
          } catch (error) {
            console.warn('Web audio play error:', error);
            setAudioError('Failed to play audio. Please try again.');
            setPlayingVerse(null);
          }
        };
        audio.load();
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: verse.audio },
          { shouldPlay: true },
          (status) => {
            if (status.error) {
              setAudioError('Failed to play audio. Please try again.');
              setPlayingVerse(null);
            }
            if (status.didJustFinish) {
              setPlayingVerse(null);
            }
          }
        );
        setSound(newSound);
        setPlayingVerse(verse.number);
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
      setAudioError('Failed to play audio. Please try again.');
      setPlayingVerse(null);
    }
  };

  const pauseAudioVerse = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
        }
      } else if (sound) {
        await sound.pauseAsync();
      }
      setPlayingVerse(null);
    } catch (error) {
      console.warn('Error pausing audio:', error);
    }
  };

  const toggleAudioVerse = useCallback(async (verse: Verse) => {
    if (playingVerse === verse.number) {
      await pauseAudioVerse();
    } else {
      await playAudioVerse(verse);
    }
  }, [playingVerse]);

  const playFullSurahAudio = async () => {
    if (!surah) return;
    
    // Stop any currently playing verse audio
    await cleanupAudio();
    
    // Use the global audio player to play the full surah
    await playAudio(
      fullSurahAudioUrl,
      `${surah.englishName} (${surah.name})`,
      `Complete Surah • ${surah.numberOfAyahs} Verses`,
      surah.number
    );
  };

  const stopFullSurahAudio = async () => {
    // If this surah is playing in the global player, pause it
    if (currentAudio?.url === fullSurahAudioUrl) {
      await pauseAudio();
    }
  };

  const toggleFullSurahAudio = async () => {
    if (isFullSurahPlaying && isPlaying) {
      await stopFullSurahAudio();
    } else {
      await playFullSurahAudio();
    }
  };

  // Toggle Arabic Only mode
  const toggleArabicOnly = () => {
    setShowArabicOnly((prev) => !prev);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Build a continuous Arabic text string, removing any inherent newlines
  const arabicOnlyText = surah.verses
    .map((verse) => `${verse.text.replace(/\n/g, ' ')} (${verse.number})`)
    .join(' ');

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['#1DB954', '#121212'] : ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800' }}
          style={styles.headerImage}
          blurRadius={2}
        />
        <View style={[styles.headerOverlay, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{surah.name}</Text>
          <Text style={styles.headerSubtitle}>{surah.englishName}</Text>
          <Text style={styles.headerInfo}>
            {surah.numberOfAyahs} Verses • {surah.revelationType}
          </Text>
        </View>
      </LinearGradient>

      <View style={[styles.controlsContainer, { backgroundColor: isDark ? '#282828' : '#F8F8F8' }]}>
        <TouchableOpacity
          onPress={toggleFullSurahAudio}
          style={[styles.controlButton, { backgroundColor: '#1DB954' }]}
        >
          <Ionicons
            name={isFullSurahPlaying && isPlaying ? 'pause' : 'play'}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.controlButtonText}>
            {isFullSurahPlaying && isPlaying ? 'Pause Full Surah' : 'Play Full Surah'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleArabicOnly}
          style={[
            styles.controlButton,
            { backgroundColor: showArabicOnly ? '#1DB954' : isDark ? '#383838' : '#EEEEEE' }
          ]}
        >
          <Ionicons
            name={showArabicOnly ? 'text' : 'text-outline'}
            size={24}
            color={showArabicOnly ? '#FFFFFF' : '#1DB954'}
          />
          <Text style={[styles.controlButtonText, { color: showArabicOnly ? '#FFFFFF' : '#1DB954' }]}>
            Arabic Only
          </Text>
        </TouchableOpacity>
      </View>

      {audioError && (
        <View style={styles.audioErrorContainer}>
          <Text style={styles.audioErrorText}>{audioError}</Text>
        </View>
      )}

      {showArabicOnly ? (
        <View style={styles.arabicOnlyContainer}>
          <Text style={[styles.arabicOnlyText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {arabicOnlyText}
          </Text>
        </View>
      ) : (
        <View style={styles.versesContainer}>
          {surah.verses.map((verse) => (
            <View
              key={verse.number}
              style={[
                styles.verseCard,
                { backgroundColor: isDark ? '#282828' : '#F8F8F8' }
              ]}
            >
              <View style={styles.verseHeader}>
                <View style={[styles.verseNumber, { backgroundColor: '#1DB954' }]}>
                  <Text style={styles.numberText}>{verse.number}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleAudioVerse(verse)}
                  style={styles.audioButton}
                >
                  <Ionicons
                    name={playingVerse === verse.number ? 'pause' : 'play'}
                    size={24}
                    color="#1DB954"
                  />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.arabicText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {verse.text}
              </Text>

              <Text style={styles.transliterationText}>
                {verse.transliteration}
              </Text>
              <Text style={[styles.translationText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                {verse.translation}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Add padding at the bottom to ensure content isn't hidden behind the sticky player */}
      {isFullSurahPlaying && <RNView style={{ height: 150 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 280,
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerInfo: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  audioErrorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef5350',
  },
  audioErrorText: {
    color: '#c62828',
    fontSize: 14,
  },
  versesContainer: {
    padding: 16,
  },
  verseCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  audioButton: {
    padding: 8,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 48,
    textAlign: 'right',
    fontFamily: 'System',
    marginBottom: 16,
  },
  transliterationText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1DB954',
    marginBottom: 12,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    margin: 20,
  },
  arabicOnlyContainer: {
    padding: 16,
  },
  arabicOnlyText: {
    fontSize: 24,
    lineHeight: 48,
    textAlign: 'justify', // Justify text to stretch from left to right
    fontFamily: 'System',
  },
});