import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

type AudioPlayerContextType = {
  isPlaying: boolean;
  currentAudio: {
    url: string;
    title: string;
    subtitle?: string;
  } | null;
  duration: number;
  position: number;
  isBuffering: boolean;
  error: string | null;
  playAudio: (url: string, title: string, subtitle?: string) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    url: string;
    title: string;
    subtitle?: string;
  } | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio references
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio
    if (Platform.OS !== 'web') {
      initializeAudioMode();
    }

    return () => {
      cleanupAudio();
    };
  }, []);

  const initializeAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.warn('Error initializing audio mode:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    } else if (status.error) {
      console.warn('Playback error:', status.error);
      setError('Playback error occurred');
    }
  };

  const playAudio = async (url: string, title: string, subtitle?: string) => {
    try {
      // Clean up any existing audio
      await cleanupAudio();
      
      setIsBuffering(true);
      setError(null);
      setCurrentAudio({ url, title, subtitle });

      if (Platform.OS === 'web') {
        const audio = new Audio();
        audio.src = url;
        
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
        
        webAudioRef.current = audio;
        setIsPlaying(true);
      } else {
        // For native platforms, use Expo AV
        try {
          const { sound, status } = await Audio.Sound.createAsync(
            { uri: url },
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
      console.warn('Error playing audio:', err);
      setError('Failed to play audio');
      setIsBuffering(false);
    }
  };

  const pauseAudio = async () => {
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.pause();
        setIsPlaying(false);
      } else if (soundRef.current) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (err) {
      console.warn('Error pausing audio:', err);
    }
  };

  const resumeAudio = async () => {
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        await webAudioRef.current.play();
        setIsPlaying(true);
      } else if (soundRef.current) {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Error resuming audio:', err);
      setError('Failed to resume audio');
    }
  };

  const stopAudio = async () => {
    await cleanupAudio();
    setCurrentAudio(null);
  };

  const seekTo = async (newPosition: number) => {
    if (duration <= 0) return;
    
    try {
      if (Platform.OS === 'web' && webAudioRef.current) {
        webAudioRef.current.currentTime = newPosition / 1000;
        setPosition(newPosition);
      } else if (soundRef.current) {
        await soundRef.current.setPositionAsync(newPosition);
        setPosition(newPosition);
      }
    } catch (err) {
      console.warn('Error seeking audio:', err);
    }
  };

  const cleanupAudio = async () => {
    try {
      if (Platform.OS === 'web') {
        if (webAudioRef.current) {
          webAudioRef.current.pause();
          webAudioRef.current.src = '';
          webAudioRef.current = null;
        }
      } else {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
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
    } catch (err) {
      console.warn('Error cleaning up audio:', err);
    }
  };

  const value = {
    isPlaying,
    currentAudio,
    duration,
    position,
    isBuffering,
    error,
    playAudio,
    pauseAudio,
    resumeAudio,
    stopAudio,
    seekTo,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}