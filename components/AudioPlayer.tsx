import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Themed';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AudioPlayerProps = {
  audioUrl: string;
  title: string;
  onError: (error: string) => void;
};

export default function AudioPlayer({ audioUrl, title, onError }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      
      // Check if audio is cached
      const cacheKey = `audio_cache_${audioUrl}`;
      const cachedUri = await AsyncStorage.getItem(cacheKey);
      
      let uri = audioUrl;
      if (!cachedUri && Platform.OS !== 'web') {
        // Download and cache the audio file
        const callback = (downloadProgress: any) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        };
        
        const downloadResumable = FileSystem.createDownloadResumable(
          audioUrl,
          FileSystem.cacheDirectory + 'audio_' + Date.now() + '.mp3',
          {},
          callback
        );

        const { uri: fileUri } = await downloadResumable.downloadAsync();
        if (fileUri) {
          await AsyncStorage.setItem(cacheKey, fileUri);
          uri = fileUri;
        }
      } else if (cachedUri) {
        uri = cachedUri;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setSound(newSound);
        setDuration(status.durationMillis || 0);
        
        // Restore last position
        const lastPosition = await AsyncStorage.getItem(`${cacheKey}_position`);
        if (lastPosition) {
          const position = parseInt(lastPosition, 10);
          await newSound.setPositionAsync(position);
          setPosition(position);
        }
      }
    } catch (error) {
      onError('Failed to load audio');
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
      setDownloadProgress(0);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
      setIsBuffering(status.isBuffering);
      
      // Save position for resume capability
      if (!status.isPlaying && status.positionMillis > 0) {
        AsyncStorage.setItem(
          `audio_cache_${audioUrl}_position`,
          status.positionMillis.toString()
        );
      }
    }
  };

  const togglePlayback = async () => {
    try {
      if (!sound) {
        await loadAudio();
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      onError('Playback error occurred');
      console.error('Playback error:', error);
    }
  };

  const onSliderValueChange = async (value: number) => {
    if (sound) {
      const newPosition = value * duration;
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const onVolumeChange = async (value: number) => {
    if (sound) {
      await sound.setVolumeAsync(value);
      setVolume(value);
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        {downloadProgress > 0 && (
          <Text style={styles.downloadText}>
            Downloading: {Math.round(downloadProgress * 100)}%
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {isBuffering && (
          <ActivityIndicator size="small" color="#2E8B57" style={styles.bufferingIndicator} />
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={50}
            color="#2E8B57"
          />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Slider
            value={duration > 0 ? position / duration : 0}
            onValueChange={onSliderValueChange}
            style={styles.progressBar}
            minimumTrackTintColor="#2E8B57"
            maximumTrackTintColor="#D1D5DB"
            thumbTintColor="#2E8B57"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.volumeContainer}>
        <Ionicons name="volume-low" size={24} color="#666" />
        <Slider
          value={volume}
          onValueChange={onVolumeChange}
          style={styles.volumeSlider}
          minimumTrackTintColor="#2E8B57"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2E8B57"
        />
        <Ionicons name="volume-high" size={24} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  downloadText: {
    marginTop: 8,
    color: '#666',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  bufferingIndicator: {
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 8,
    height: 40,
  },
});