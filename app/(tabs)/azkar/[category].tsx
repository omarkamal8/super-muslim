import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CategoryHeader from '../../../components/azkar/CategoryHeader';
import ZikrCard from '../../../components/azkar/ZikrCard';
import { azkarData } from '../../../data/azkarData';

export default function AzkarCategoryScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const categoryId = Array.isArray(category) ? category[0] : category;
  const categoryData = azkarData[categoryId as string];

  if (!categoryData) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
        </TouchableOpacity>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => router.push('/azkar')}
          >
            <Text style={styles.returnButtonText}>Return to Categories</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <ScrollView>
        <CategoryHeader
          title={categoryData.title}
          arabicTitle={categoryData.arabicTitle}
          description={categoryData.description}
          imageUrl={categoryData.image}
        />
        
        <View style={styles.content}>
          {categoryData.items.map((zikr) => (
            <ZikrCard key={zikr.id} zikr={zikr} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 10,
  },
  content: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  returnButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});