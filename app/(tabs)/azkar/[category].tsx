import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Zikr = {
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  repetitions: number;
  virtue: string;
};

const azkarData: Record<string, {
  title: string;
  arabicTitle: string;
  description: string;
  image: string;
  items: Zikr[];
}> = {
  morning: {
    title: 'Morning Azkar',
    arabicTitle: 'أذكار الصباح',
    description: 'Remembrance after Fajr prayer until sunrise',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ',
        translation: 'We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner',
        transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah",
        repetitions: 1,
        virtue: 'Whoever recites this in the morning has thanked Allah for the day'
      },
      {
        id: 2,
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
        translation: 'O Allah, I seek refuge in You from anxiety and sorrow',
        transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan",
        repetitions: 3,
        virtue: 'Protection from anxiety and sorrow throughout the day'
      }
    ]
  },
  evening: {
    title: 'Evening Azkar',
    arabicTitle: 'أذكار المساء',
    description: 'Remembrance after Asr prayer until Maghrib',
    image: 'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?w=800',
    items: [
      {
        id: 1,
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ',
        translation: 'We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner',
        transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallah wahdahu la shareeka lah",
        repetitions: 1,
        virtue: 'Whoever recites this in the evening has thanked Allah for the night'
      }
    ]
  },
  // Add more categories as needed
};

export default function AzkarCategoryScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const categoryData = azkarData[category as string];
  const [completedZikr, setCompletedZikr] = useState<Record<number, number>>({});

  if (!categoryData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  const handleRepetition = (zikrId: number, totalRepetitions: number) => {
    setCompletedZikr(prev => {
      const current = (prev[zikrId] || 0) + 1;
      return {
        ...prev,
        [zikrId]: current > totalRepetitions ? 0 : current
      };
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['#1DB954', '#121212'] : ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <Image
          source={{ uri: categoryData.image }}
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
          <Text style={styles.headerTitle}>{categoryData.arabicTitle}</Text>
          <Text style={styles.headerSubtitle}>{categoryData.title}</Text>
          <Text style={styles.headerDescription}>{categoryData.description}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {categoryData.items.map((zikr) => (
          <View
            key={zikr.id}
            style={[
              styles.zikrCard,
              { backgroundColor: isDark ? '#282828' : '#F8F8F8' }
            ]}
          >
            <View style={[styles.zikrHeader, { backgroundColor: 'transparent' }]}>
              <View style={styles.repetitionsContainer}>
                <Text style={[styles.repetitionsText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                  {completedZikr[zikr.id] || 0}/{zikr.repetitions}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    { backgroundColor: '#1DB954' }
                  ]}
                  onPress={() => handleRepetition(zikr.id, zikr.repetitions)}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.arabicText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              {zikr.arabic}
            </Text>
            <Text style={styles.transliterationText}>{zikr.transliteration}</Text>
            <Text style={[styles.translationText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
              {zikr.translation}
            </Text>
            
            <View style={styles.virtueContainer}>
              <Ionicons name="information-circle" size={20} color="#1DB954" />
              <Text style={styles.virtueText}>{zikr.virtue}</Text>
            </View>
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
    height: 250,
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
  headerDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  zikrCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zikrHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  repetitionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  repetitionsText: {
    fontSize: 18,
    fontWeight: '600',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 42,
    textAlign: 'right',
    marginBottom: 12,
    fontFamily: 'System',
  },
  transliterationText: {
    fontSize: 16,
    color: '#1DB954',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  virtueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  virtueText: {
    flex: 1,
    fontSize: 14,
    color: '#1DB954',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 20,
  },
});