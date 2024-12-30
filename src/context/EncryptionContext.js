import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateEncryptionKey, storeEncryptionKey, getStoredEncryptionKey } from '../utils/encryption';

const EncryptionContext = createContext();

export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

export const EncryptionProvider = ({ children }) => {
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState(null);

  // Initialize encryption state and ensure key is valid
  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        const key = await getStoredEncryptionKey();
        const storedPreference = localStorage.getItem('encryption_enabled');
        const shouldEnableEncryption = storedPreference === 'true';
        
        if (key) {
          setEncryptionKey(key);
          setIsEncryptionEnabled(shouldEnableEncryption);
          console.log('Encryption key loaded successfully');
        } else {
          setEncryptionKey(null);
          setIsEncryptionEnabled(false);
          console.log('No encryption key found');
        }
      } catch (error) {
        console.error('Error initializing encryption:', error);
        setEncryptionKey(null);
        setIsEncryptionEnabled(false);
        localStorage.removeItem('note_encryption_key');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeEncryption();
  }, []);

  const toggleEncryption = async () => {
    try {
      if (!isEncryptionEnabled) {
        // Try to get existing key first
        let key = await getStoredEncryptionKey();
        if (!key) {
          // Generate new key only if no existing key
          key = await generateEncryptionKey();
          await storeEncryptionKey(key);
        }
        setEncryptionKey(key);
        setIsEncryptionEnabled(true);
        localStorage.setItem('encryption_enabled', 'true');
      } else {
        setIsEncryptionEnabled(false);
        localStorage.setItem('encryption_enabled', 'false');
      }
    } catch (error) {
      console.error('Error toggling encryption:', error);
    }
  };

  if (!isInitialized) {
    return null; // Don't render children until encryption is initialized
  }

  return (
    <EncryptionContext.Provider value={{ isEncryptionEnabled, toggleEncryption, encryptionKey }}>
      {children}
    </EncryptionContext.Provider>
  );
}; 