import { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type Verse = {
  number: number;
  text: string;
  translation: string;
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
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState(false);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

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
      setIsFullSurahPlaying(false);
      setAudioError(null);
    } catch (err) {
      console.warn('Error cleaning up audio:', err);
    }
  };

  const fetchSurahDetails = async () => {
    try {
      const textResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}`
      );
      const textData = await textResponse.json();

      const translationResponse = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`
      );
      const translationData = await translationResponse.json();

      if (textData.code === 200 && translationData.code === 200) {
        const verses = textData.data.ayahs.map((ayah: any, index: number) => ({
          number: ayah.numberInSurah,
          text: ayah.text,
          translation: translationData.data.ayahs[index].text,
          audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`,
        }));

        setSurah({
          number: textData.data.number,
          name: textData.data.name,
          englishName: textData.data.englishName,
          englishNameTranslation: textData.data.englishNameTranslation,
          numberOfAyahs: textData.data.numberOfAyahs,
          revelationType: textData.data.revelationType,
          verses,
        });
      } else {
        setError('Failed to load surah data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (verse: Verse) => {
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

  const pauseAudio = async () => {
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

  const toggleAudio = useCallback(async (verse: Verse) => {
    if (playingVerse === verse.number) {
      await pauseAudio();
    } else {
      await playAudio(verse);
    }
  }, [playingVerse]);

  // New functions for full surah playback using the updated endpoint
  const playFullSurahAudio = async () => {
    if (!surah) return;
    try {
      setAudioError(null);
      await cleanupAudio();
      // Updated full surah audio URL with the new endpoint
      const fullAudioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`;
      if (Platform.OS === 'web') {
        const audio = new Audio();
        audio.src = fullAudioUrl;
        audio.onerror = () => {
          console.warn('Web full surah audio error:', audio.error);
          setAudioError('Failed to play full surah audio. Please try again.');
          setIsFullSurahPlaying(false);
        };
        audio.onended = () => {
          setIsFullSurahPlaying(false);
        };
        audio.oncanplaythrough = async () => {
          try {
            await audio.play();
            webAudioRef.current = audio;
            setIsFullSurahPlaying(true);
          } catch (error) {
            console.warn('Web full surah audio play error:', error);
            setAudioError('Failed to play full surah audio. Please try again.');
            setIsFullSurahPlaying(false);
          }
        };
        audio.load();
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: fullAudioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.error) {
              setAudioError('Failed to play full surah audio. Please try again.');
              setIsFullSurahPlaying(false);
            }
            if (status.didJustFinish) {
              setIsFullSurahPlaying(false);
            }
          }
        );
        setSound(newSound);
        setIsFullSurahPlaying(true);
      }
    } catch (error) {
      console.warn('Full surah audio playback error:', error);
      setAudioError('Failed to play full surah audio. Please try again.');
      setIsFullSurahPlaying(false);
    }
  };

  const pauseFullSurahAudio = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
        }
      } else if (sound) {
        await sound.pauseAsync();
      }
      setIsFullSurahPlaying(false);
    } catch (error) {
      console.warn('Error pausing full surah audio:', error);
    }
  };

  const toggleFullSurahAudio = async () => {
    if (isFullSurahPlaying) {
      await pauseFullSurahAudio();
    } else {
      await playFullSurahAudio();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  if (error || !surah) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1597935258735-e254c1839512?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>{surah.name}</Text>
          <Text style={styles.headerSubtitle}>{surah.englishName}</Text>
          <Text style={styles.headerInfo}>
            {surah.numberOfAyahs} Verses • {surah.revelationType}
          </Text>
        </View>
      </View>

      {/* Full Surah Player */}
      <View style={styles.fullSurahPlayerContainer}>
        <TouchableOpacity onPress={toggleFullSurahAudio} style={styles.fullSurahButton}>
          <Ionicons
            name={isFullSurahPlaying ? 'pause' : 'play'}
            size={24}
            color="#fff"
          />
          <Text style={styles.fullSurahButtonText}>
            {isFullSurahPlaying ? 'Pause Full Surah' : 'Play Full Surah'}
          </Text>
        </TouchableOpacity>
      </View>

      {audioError && (
        <View style={styles.audioErrorContainer}>
          <Text style={styles.audioErrorText}>{audioError}</Text>
        </View>
      )}

      <View style={styles.versesContainer}>
        {surah.verses.map((verse) => (
          <View key={verse.number} style={styles.verseCard}>
            <View style={styles.verseHeader}>
              <View style={styles.verseNumber}>
                <Text style={styles.numberText}>{verse.number}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleAudio(verse)}
                style={styles.audioButton}
              >
                <Ionicons
                  name={playingVerse === verse.number ? 'pause' : 'play'}
                  size={24}
                  color="#2E8B57"
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.arabicText}>{verse.text}</Text>
            <Text style={styles.translationText}>{verse.translation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerInfo: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  fullSurahPlayerContainer: {
    backgroundColor: '#2E8B57',
    padding: 16,
    alignItems: 'center',
  },
  fullSurahButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullSurahButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
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
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
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
    color: '#333',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});
