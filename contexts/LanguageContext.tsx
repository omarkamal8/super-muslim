import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
};

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true,
  },
];

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@app_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguageCode = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguageCode) {
        const language = languages.find(lang => lang.code === savedLanguageCode);
        if (language) {
          await applyLanguage(language);
        }
      }
    } catch (error) {
      console.warn('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyLanguage = async (language: Language) => {
    try {
      // Update RTL setting
      if (I18nManager.isRTL !== language.isRTL) {
        I18nManager.forceRTL(language.isRTL);
        // In a real app, you might want to reload the app here
      }

      setCurrentLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language.code);
    } catch (error) {
      console.warn('Error applying language:', error);
    }
  };

  const value = {
    currentLanguage,
    setLanguage: applyLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}