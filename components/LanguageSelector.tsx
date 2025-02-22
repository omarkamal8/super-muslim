import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, View } from 'react-native';
import { Text } from './Themed';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, languages, Language } from '../contexts/LanguageContext';

type LanguageSelectorProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function LanguageSelector({ isVisible, onClose }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleConfirm = async () => {
    if (selectedLanguage) {
      await setLanguage(selectedLanguage);
      onClose();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.languageList}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  selectedLanguage?.code === language.code && styles.selectedOption,
                  currentLanguage.code === language.code && styles.currentOption,
                ]}
                onPress={() => handleLanguageSelect(language)}
              >
                <View style={styles.languageInfo}>
                  <Ionicons
                    name={language.isRTL ? 'text' : 'text-outline'}
                    size={24}
                    color="#2E8B57"
                  />
                  <View style={styles.languageTexts}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    <Text style={styles.nativeName}>{language.nativeName}</Text>
                  </View>
                </View>
                {(selectedLanguage?.code === language.code ||
                  currentLanguage.code === language.code) && (
                  <Ionicons
                    name={
                      selectedLanguage?.code === language.code
                        ? 'checkmark-circle'
                        : 'checkmark-circle-outline'
                    }
                    size={24}
                    color="#2E8B57"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                !selectedLanguage && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!selectedLanguage}
            >
              <Text style={[styles.buttonText, styles.confirmButtonText]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  languageList: {
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#e8f5e9',
  },
  currentOption: {
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageTexts: {
    marginLeft: 12,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  nativeName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#2E8B57',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
  },
});