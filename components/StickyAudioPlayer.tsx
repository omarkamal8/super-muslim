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
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Audio object reference for web
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      }).start();
      
      // Cleanup audio
      cleanupAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [isVisible]);

  const initializeAudio = async () => {
    try {
      setIsBuffering(true);
      setError(null);

      if (Platform.OS === 'web') {
        if (!audioRef.current) {
          const audio = new Audio(audioUrl);
          
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
        // For native platforms, you would use Expo AV
        // This is a placeholder for the actual implementation
        console.log('Native audio would be initialized here');
        // Simulate loading
        setTimeout(() => {
          setDuration(300000); // 5 minutes in ms
          setIsBuffering(false);
        }, 1500);
      }
    } catch (err) {
      console.warn('Error initializing audio:', err);
      setError('Failed to initialize audio');
      setIsBuffering(false);
    }
  };

  const cleanupAudio = () => {
    if (Platform.OS === 'web' && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
    setIsBuffering(false);
  };

  const togglePlayback = async () => {
    if (Platform.OS === 'web' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          await audioRef.current.play();
        } catch (err) {
          console.warn('Error playing audio:', err);
          setError('Failed to play audio');
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onSliderValueChange = (value: number) => {
    if (Platform.OS === 'web' && audioRef.current && duration > 0) {
      const newPosition = value * duration;
      audioRef.current.currentTime = newPosition / 1000;
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
                disabled={isBuffering}
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