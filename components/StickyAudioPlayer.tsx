import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { Text } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useColorScheme } from 'react-native';
import { Audio } from 'expo-av';

type StickyAudioPlayerProps = {
  isVisible: boolean;
  audioUrl: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
};

const { width } = Dimensions.get('window');

export default function StickyAudioPlayer({
  isVisible,
  audioUrl,
  title,
  subtitle,
  onClose
}: StickyAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slideAnim = React.useRef(new Animated.Value(100)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Audio references
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const positionIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8
      }).start();
      
      // Initialize audio
      initializeAudio();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      // Cleanup audio
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [isVisible, audioUrl]);

  const initializeAudio = async () => {
    try {
      setIsBuffering(true);
      setError(null);

      if (Platform.OS === 'web') {
        if (!audioRef.current) {
          const audio = new Audio();
          audio.src = audioUrl;
          
          audio.onloadedmetadata = () => {
            setDuration(audio.duration * 1000);
            setIsBuffering(false);
          };
          
          audio.ontimeupdate = () => {
            setPosition(audio.currentTime * 1000);
          };
          
          audio.onended = () => {
            setIsPlaying(false);
            setPosition(0);
          };
          
          audio.onwaiting = () => {
            setIsBuffering(true);
          };
          
          audio.onplaying = () => {
            setIsBuffering(false);
          };
          
          audio.onerror = () => {
            console.warn('Web audio error:', audio.error);
            setError('Failed to play audio');
            setIsBuffering(false);
          };
          
          audio.play().catch(err => {
            console.warn('Error playing audio:', err);
            setError('Failed to play audio');
            setIsBuffering(false);
          });
          
          audioRef.current = audio;
          setIsPlaying(true);
        }
      } else {
        // For native platforms, use Expo AV
        try {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
          }
          
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          
          soundRef.current = sound;
          setIsPlaying(true);
          
          // Start a timer to update position for native platforms
          if (positionIntervalRef.current) {
            clearInterval(positionIntervalRef.current);
          }
          
          positionIntervalRef.current = setInterval(async () => {
            if (soundRef.current) {
              const status = await soundRef.current.getStatusAsync();
              if (status.isLoaded) {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis || 0);
                setIsBuffering(status.isBuffering);
              }
            }
          }, 1000);
        } catch (err) {
          console.warn('Native audio error:', err);
          setError('Failed to play audio');
          setIsBuffering(false);
        }
      }
    } catch (err) {
      console.warn('Error initializing audio:', err);
      setError('Failed to initialize audio');
      setIsBuffering(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    } else if (status.error) {
      console.warn('Playback error:', status.error);
      setError('Playback error occurred');
    }
  };

  const cleanupAudio = () => {
    if (Platform.OS === 'web') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    } else {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(err => {
          console.warn('Error unloading sound:', err);
        });
        soundRef.current = null;
      }
      
      if (positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
        positionIntervalRef.current = null;
      }
    }
    
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
    setIsBuffering(false);
    setError(null);
  };

  const togglePlayback = async () => {
    try {
      if (Platform.OS === 'web' && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } else if (soundRef.current) {
        if (isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (err) {
      console.warn('Error toggling playback:', err);
      setError('Failed to control playback');
    }
  };

  const onSliderValueChange = (value: number) => {
    if (duration <= 0) return;
    
    const newPosition = value * duration;
    
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.currentTime = newPosition / 1000;
      setPosition(newPosition);
    } else if (soundRef.current) {
      soundRef.current.setPositionAsync(newPosition).catch(err => {
        console.warn('Error setting position:', err);
      });
      setPosition(newPosition);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeAudio}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.titleContainer}>
            <View style={styles.textContainer}>
              <Text 
                style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]} 
                numberOfLines={1}
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  style={[styles.subtitle, { color: isDark ? '#B3B3B3' : '#666666' }]} 
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
            </TouchableOpacity>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={36}
                color="#1DB954"
              />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <Slider
                value={duration > 0 ? position / duration : 0}
                onValueChange={onSliderValueChange}
                style={styles.progressBar}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor={isDark ? '#555555' : '#D1D5DB'}
                thumbTintColor="#1DB954"
                disabled={isBuffering || duration <= 0}
              />
              <View style={styles.timeContainer}>
                <Text style={[styles.timeText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                  {formatTime(position)}
                </Text>
                <Text style={[styles.timeText, { color: isDark ? '#B3B3B3' : '#666666' }]}>
                  {formatTime(duration)}
                </Text>
              </View>
            </View>

            {isBuffering && (
              <ActivityIndicator size="small" color="#1DB954" style={styles.bufferingIndicator} />
            )}
          </View>
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
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    marginRight: 12,
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
});