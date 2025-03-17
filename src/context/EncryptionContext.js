import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateEncryptionKey, storeEncryptionKey, getStoredEncryptionKey } from '../utils/encryption';
import { storeKeyInCloud, getKeyFromCloud, checkCloudKeyExists } from '../utils/cloudKeyStorage';
import { auth } from '../firebase';

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
  const [hasCloudKey, setHasCloudKey] = useState(false);

  // Initialize encryption state and ensure key is valid
  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        const user = auth.currentUser;
        
        // First try to get local key
        const localKey = await getStoredEncryptionKey();
        const storedPreference = localStorage.getItem('encryption_enabled');
        const shouldEnableEncryption = storedPreference === 'true';
        
        // Check if user has a cloud key
        if (user) {
          const cloudKeyExists = await checkCloudKeyExists(user.uid);
          setHasCloudKey(cloudKeyExists);
        }

        if (localKey) {
          setEncryptionKey(localKey);
          setIsEncryptionEnabled(shouldEnableEncryption);
          console.log('Encryption key loaded successfully from local storage');
        } else {
          setEncryptionKey(null);
          setIsEncryptionEnabled(false);
          console.log('No encryption key found in local storage');
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

  // New function to store key in cloud
  const saveKeyToCloud = async (password) => {
    try {
      const user = auth.currentUser;
      if (!user || !encryptionKey) {
        throw new Error('User must be logged in and encryption key must exist');
      }

      const success = await storeKeyInCloud(user.uid, encryptionKey, password);
      if (success) {
        setHasCloudKey(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving key to cloud:', error);
      return false;
    }
  };

  // New function to retrieve key from cloud
  const loadKeyFromCloud = async (password) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be logged in');
      }

      const cloudKey = await getKeyFromCloud(user.uid, password);
      if (cloudKey) {
        setEncryptionKey(cloudKey);
        await storeEncryptionKey(cloudKey); // Also store locally
        setIsEncryptionEnabled(true);
        localStorage.setItem('encryption_enabled', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading key from cloud:', error);
      return false;
    }
  };

  if (!isInitialized) {
    return null; // Don't render children until encryption is initialized
  }

  return (
    <EncryptionContext.Provider 
      value={{ 
        isEncryptionEnabled, 
        toggleEncryption, 
        encryptionKey,
        hasCloudKey,
        saveKeyToCloud,
        loadKeyFromCloud
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}; 