import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, View as RNView, Platform } from 'react-native';
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
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchSurahs();
  }, []);

  useEffect(() => {
    if (surahs.length > 0) {
      const filtered = surahs.filter(
        surah =>
          surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          surah.number.toString().includes(searchQuery)
      );
      setFilteredSurahs(filtered);
    }
  }, [searchQuery, surahs]);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      if (data.code === 200) {
        setSurahs(data.data);
        setFilteredSurahs(data.data);
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
    router.push(`/home/surah/${surahNumber}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>Loading Quran...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#8B4513" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSurahs}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(139, 69, 19, 0.9)', 'rgba(139, 69, 19, 0.7)']}
        style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1591456983933-0c66ac26d936?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Super Muslim</Text>
          <Text style={styles.headerSubtitle}>Read and Listen to the Holy Quran</Text>
        </View>
      </LinearGradient>

      <RNView style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8B4513" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search surah by name or number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8B4513"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#8B4513" />
          </TouchableOpacity>
        )}
      </RNView>

      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.surahItem}
            onPress={() => navigateToSurah(item.number)}>
            <View style={styles.surahNumber}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View style={styles.surahInfo}>
              <Text style={styles.surahName}>{item.name}</Text>
              <Text style={styles.surahEnglishName}>{item.englishName}</Text>
              <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
            </View>
            <View style={styles.surahMeta}>
              <RNView style={styles.verseBadge}>
                <Text style={styles.verseBadgeText}>{item.numberOfAyahs}</Text>
                <Text style={styles.verseBadgeLabel}>verses</Text>
              </RNView>
              <Ionicons name="chevron-forward" size={20} color="#8B4513" />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#8B4513" />
            <Text style={styles.emptyText}>No surahs found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B4513',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8DC',
  },
  header: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF8DC',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFF8DC',
    opacity: 0.9,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAEBD7',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D1810',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  surahItem: {
    flexDirection: 'row',
    backgroundColor: '#FAEBD7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    color: '#FFF8DC',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D1810',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  surahEnglishName: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif',
  },
  surahTranslation: {
    fontSize: 14,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif-light',
  },
  surahMeta: {
    alignItems: 'flex-end',
  },
  verseBadge: {
    backgroundColor: '#8B4513',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  verseBadgeText: {
    color: '#FFF8DC',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  verseBadgeLabel: {
    color: '#FFF8DC',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8B4513',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  errorText: {
    color: '#8B4513',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'sans-serif',
  },
  retryButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFF8DC',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
});