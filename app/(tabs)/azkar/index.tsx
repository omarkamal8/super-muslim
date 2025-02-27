import { StyleSheet, FlatList, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { azkarData } from '../../../data/azkarData';

type AzkarCategory = {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
};

// Create a list of categories from the azkarData
const azkarCategories: AzkarCategory[] = Object.entries(azkarData).map(([id, data]) => ({
  id,
  title: data.title,
  arabicTitle: data.arabicTitle,
  description: data.description,
  // Map category IDs to appropriate icons
  icon: mapCategoryToIcon(id),
  count: data.items.length,
}));

// Helper function to map category IDs to appropriate icons
function mapCategoryToIcon(categoryId: string): keyof typeof Ionicons.glyphMap {
  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    morning: 'sunny',
    evening: 'moon',
    sleep: 'bed',
    wake: 'alarm',
    prayer: 'pray',
    mosque: 'business',
    food: 'restaurant',
    travel: 'airplane',
    distress: 'heart-dislike',
    forgiveness: 'heart',
  };
  
  return iconMap[categoryId] || 'bookmark';
}

export default function AzkarScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const navigateToCategory = (categoryId: string) => {
    router.push(`/azkar/${categoryId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <LinearGradient
        colors={isDark ? ['#1DB954', '#121212'] : ['#1DB954', '#FFFFFF']}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800' }}
          style={styles.headerImage}
          blurRadius={2}
        />
        <View style={[styles.headerOverlay, { backgroundColor: 'transparent' }]}>
          <Text style={styles.headerTitle}>Daily Azkar</Text>
          <Text style={styles.headerSubtitle}>Islamic Remembrance & Supplications</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={azkarCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              { backgroundColor: isDark ? '#282828' : '#F8F8F8' }
            ]}
            onPress={() => navigateToCategory(item.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#1DB954' }]}>
              <Ionicons name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={[styles.cardContent, { backgroundColor: 'transparent' }]}>
              <Text style={[styles.arabicTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {item.arabicTitle}
              </Text>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
                {item.title}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.count}>{item.count} items</Text>
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
    height: 200,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    padding: 16,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
  },
  arabicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  count: {
    fontSize: 12,
    color: '#1DB954',
    fontWeight: '600',
  },
});