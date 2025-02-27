import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View as RNView } from 'react-native';
import { View, Text } from '../Themed';
import { Ionicons } from '@expo/vector-icons';

type ZikrCardProps = {
  zikr: {
    id: number;
    arabic: string;
    translation: string;
    transliteration: string;
    repetitions: number;
    virtue: string;
  };
};

export default function ZikrCard({ zikr }: ZikrCardProps) {
  const [completedCount, setCompletedCount] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleRepetition = () => {
    setCompletedCount(prev => {
      const current = prev + 1;
      return current > zikr.repetitions ? 0 : current;
    });
  };

  return (
    <View
      style={[
        styles.zikrCard,
        { backgroundColor: isDark ? '#282828' : '#F8F8F8' }
      ]}
    >
      <View style={[styles.zikrHeader, { backgroundColor: 'transparent' }]}>
        <View style={styles.repetitionsContainer}>
          <Text style={[styles.repetitionsText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
            {completedCount}/{zikr.repetitions}
          </Text>
          <TouchableOpacity
            style={[
              styles.counterButton,
              { backgroundColor: '#1DB954' }
            ]}
            onPress={handleRepetition}
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
      
      <RNView style={styles.virtueContainer}>
        <Ionicons name="information-circle" size={20} color="#1DB954" />
        <Text style={styles.virtueText}>{zikr.virtue}</Text>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});