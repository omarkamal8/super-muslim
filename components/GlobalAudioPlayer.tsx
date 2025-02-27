import React, { useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  View as RNView,
  useColorScheme,
  Switch
} from 'react-native';
import { Text } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';

const { width } = Dimensions.get('window');

export default function GlobalAudioPlayer() {
  const {
    isPlaying,
    currentAudio,
    duration,
    position,
    isBuffering,
    error,
    autoPlayEnabled,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
    playNextSurah,
    playPreviousSurah,
    toggleAutoPlay,
    isFirstSurah,
    isLastSurah
  } = useAudioPlayer();
  
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (currentAudio) {
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8
      }).start();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [currentAudio]);

  const togglePlayback = async () => {
    if (isPlaying) {
      await pauseAudio();
    } else {
      await resumeAudio();
    }
  };

  const onSliderValueChange = (value: number) => {
    if (duration <= 0) return;
    const newPosition = value * duration;
    seekTo(newPosition);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentAudio) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ translateY: slideAnim }],
          backgroundColor: isDark ? '#282828' : '#F8F8F8',
          borderColor: isDark ? '#383838' : '#E0E0E0'
        }
      ]}
    >
      {error ? (
        <RNView style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={resumeAudio}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </RNView>
      ) : (
        <>
          <RNView style={styles.titleContainer}>
            <RNView style={styles.textContainer}>
              <Text 
                style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]} 
                numberOfLines={1}
              >
                {currentAudio.title}
              </Text>
              {currentAudio.subtitle && (
                <Text 
                  style={[styles.subtitle, { color: isDark ? '#B3B3B3' : '#666666' }]} 
                  numberOfLines={1}
                >
                  {currentAudio.subtitle}
                </Text>
              )}
            </RNView>
            <TouchableOpacity style={styles.closeButton} onPress={stopAudio}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
            </TouchableOpacity>
          </RNView>

          <RNView style={styles.navigationContainer}>
            <TouchableOpacity 
              onPress={playPreviousSurah} 
              style={[styles.navButton, isFirstSurah && styles.disabledButton]}
              disabled={isFirstSurah}
            >
              <Ionicons
                name="play-skip-back"
                size={24}
                color={isFirstSurah ? (isDark ? '#555555' : '#CCCCCC') : '#1DB954'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={36}
                color="#1DB954"
              />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={playNextSurah} 
              style={[styles.navButton, isLastSurah && styles.disabledButton]}
              disabled={isLastSurah}
            >
              <Ionicons
                name="play-skip-forward"
                size={24}
                color={isLastSurah ? (isDark ? '#555555' : '#CCCCCC') : '#1DB954'}
              />
            </TouchableOpacity>
          </RNView>

          <RNView style={styles.controlsContainer}>
            <RNView style={styles.progressContainer}>
              <Slider
                value={duration > 0 ? position / duration : 0}
                onValueChange={onSliderValueChange}
                style={styles.progressBar}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor={isDark ? '#555555' : '#D1D5DB'}
                thumbTintColor="#1DB954"
                disabled={isBuffering || duration <= 0}
              />
              <RNView style={styles.timeContainer}>
                <Text style={[styles.timeText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                  {formatTime(position)}
                </Text>
                <Text style={[styles.timeText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                  {formatTime(duration)}
                </Text>
              </RNView>
            </RNView>

            {isBuffering && (
              <ActivityIndicator size="small" color="#1DB954" style={styles.bufferingIndicator} />
            )}
          </RNView>

          <RNView style={styles.settingsContainer}>
            <RNView style={styles.autoPlayContainer}>
              <Text style={[styles.autoPlayText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                Auto-play next surah
              </Text>
              <Switch
                value={autoPlayEnabled}
                onValueChange={toggleAutoPlay}
                trackColor={{ false: isDark ? '#555555' : '#D1D5DB', true: '#1DB954' }}
                thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
              />
            </RNView>
          </RNView>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Position above tab bar
    left: 0,
    right: 0,
    padding: 12,
    borderTopWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  playButton: {
    marginHorizontal: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 40,
    marginTop: -8,
    marginBottom: -8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
  bufferingIndicator: {
    marginLeft: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  errorText: {
    color: '#FF4444',
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  settingsContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  autoPlayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoPlayText: {
    fontSize: 12,
    marginRight: 8,
  }
});