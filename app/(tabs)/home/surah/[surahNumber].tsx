import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { View, Text } from '../../../../components/Themed';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AudioPlayer from '../../../../components/AudioPlayer';

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

type Reciter = {
  id: number;
  name: string;
  style: string;
};

const RECITERS: Reciter[] = [
  { id: 1, name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 2, name: 'Abdul Rahman Al-Sudais', style: 'Murattal' },
  { id: 3, name: 'Saud Al-Shuraim', style: 'Murattal' },
];

export default function SurahDetailScreen() {
  const { surahNumber } = useLocalSearchParams();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurahDetails();
  }, [surahNumber]);

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

  const handleAudioError = (error: string) => {
    setAudioError(error);
    setTimeout(() => setAudioError(null), 3000);
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

      <View style={styles.reciterContainer}>
        <Text style={styles.reciterLabel}>Select Reciter:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reciterList}>
          {RECITERS.map((reciter) => (
            <TouchableOpacity
              key={reciter.id}
              style={[
                styles.reciterItem,
                selectedReciter.id === reciter.id && styles.selectedReciter,
              ]}
              onPress={() => setSelectedReciter(reciter)}>
              <Text
                style={[
                  styles.reciterName,
                  selectedReciter.id === reciter.id && styles.selectedReciterText,
                ]}>
                {reciter.name}
              </Text>
              <Text
                style={[
                  styles.reciterStyle,
                  selectedReciter.id === reciter.id && styles.selectedReciterText,
                ]}>
                {reciter.style}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {audioError && (
        <View style={styles.audioErrorContainer}>
          <Text style={styles.audioErrorText}>{audioError}</Text>
        </View>
      )}

      <View style={styles.playerContainer}>
        <AudioPlayer
          audioUrl={`https://cdn.islamic.network/quran/audio/128/${selectedReciter.id === 1 ? 'ar.alafasy' : selectedReciter.id === 2 ? 'ar.sudais' : 'ar.shuraim'}/${surah.number}.mp3`}
          title={`${surah.englishName} - ${selectedReciter.name}`}
          onError={handleAudioError}
        />
      </View>

      <View style={styles.versesContainer}>
        {surah.verses.map((verse) => (
          <View key={verse.number} style={styles.verseCard}>
            <View style={styles.verseHeader}>
              <View style={styles.verseNumber}>
                <Text style={styles.numberText}>{verse.number}</Text>
              </View>
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
  reciterContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  reciterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  reciterList: {
    flexDirection: 'row',
  },
  reciterItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
    minWidth: 150,
  },
  selectedReciter: {
    backgroundColor: '#2E8B57',
  },
  reciterName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reciterStyle: {
    fontSize: 12,
    color: '#666',
  },
  selectedReciterText: {
    color: '#fff',
  },
  playerContainer: {
    padding: 16,
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