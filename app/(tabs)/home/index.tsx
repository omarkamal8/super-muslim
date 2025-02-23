import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Surah = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
};

export default function QuranScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
      } else {
        setError('Failed to load Quran data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSurah = (surahNumber: number) => {
    router.push(`/(tabs)/home/${surahNumber}`);
  };

  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.name.toLowerCase().includes(query) ||
      surah.englishName.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSurahs}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF' }]}>
      <LinearGradient
        colors={colorScheme === 'dark' ? 
          ['#1DB954', '#121212'] : 
          ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1584286595398-a59e7dfb7991?w=800' }}
          style={styles.headerImage}
          blurRadius={2}
        />
        <View style={[styles.headerOverlay, { backgroundColor: 'transparent' }]}>
          <Text style={styles.headerTitle}>Al-Quran</Text>
          <Text style={styles.headerSubtitle}>Read and Listen to the Holy Quran</Text>
        </View>
      </LinearGradient>

      <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#282828' : '#F8F8F8' }]}>
        <Ionicons name="search" size={20} color="#B3B3B3" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}
          placeholder="Search Surahs..."
          placeholderTextColor="#B3B3B3"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.surahItem, { backgroundColor: colorScheme === 'dark' ? '#282828' : '#F8F8F8' }]}
            onPress={() => navigateToSurah(item.number)}
          >
            <View style={[styles.surahNumber, { backgroundColor: '#1DB954' }]}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View style={[styles.surahInfo, { backgroundColor: 'transparent' }]}>
              <Text style={[styles.surahName, { color: colorScheme === 'dark' ? '#FFFFFF' : '#1A1A1A' }]}>
                {item.name}
              </Text>
              <Text style={styles.surahEnglishName}>{item.englishName}</Text>
              <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
            </View>
            <View style={[styles.surahMeta, { backgroundColor: 'transparent' }]}>
              <Text style={styles.ayahCount}>{item.numberOfAyahs} verses</Text>
              <Ionicons name="chevron-forward" size={20} color="#1DB954" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  listContainer: {
    padding: 16,
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  surahEnglishName: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 2,
  },
  surahTranslation: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  surahMeta: {
    alignItems: 'flex-end',
  },
  ayahCount: {
    fontSize: 12,
    color: '#B3B3B3',
    marginBottom: 4,
  },
  errorText: {
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});