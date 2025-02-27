import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { View, Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

type CategoryHeaderProps = {
  title: string;
  arabicTitle: string;
  description: string;
  imageUrl: string;
};

export default function CategoryHeader({ title, arabicTitle, description, imageUrl }: CategoryHeaderProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1DB954', 'transparent']}
      style={styles.header}
    >
      <Image
        source={{ uri: imageUrl }}
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
        <Text style={styles.headerTitle}>{arabicTitle}</Text>
        <Text style={styles.headerSubtitle}>{title}</Text>
        <Text style={styles.headerDescription}>{description}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
});