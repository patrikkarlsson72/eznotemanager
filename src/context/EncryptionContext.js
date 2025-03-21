import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateEncryptionKey, storeEncryptionKey, getStoredEncryptionKey, decryptData, encryptData } from '../utils/encryption';
import { storeKeyInCloud, getKeyFromCloud, checkCloudKeyExists, changeKeyPassword } from '../utils/cloudKeyStorage';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

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
  const [showCloudKeyModal, setShowCloudKeyModal] = useState(false);

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
          
          // If we have a cloud key but no local key, prompt to load from cloud
          if (cloudKeyExists && !localKey && shouldEnableEncryption) {
            setShowCloudKeyModal(true);
          }
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
      console.log('Toggling encryption. Current state:', { isEncryptionEnabled, hasCloudKey });
      
      if (!isEncryptionEnabled) {
        // Enable encryption
        let key = await getStoredEncryptionKey();
        if (!key) {
          // If we have a cloud key but no local key, show the modal to load it
          const user = auth.currentUser;
          if (user && hasCloudKey) {
            console.log('Cloud key exists but no local key, showing modal');
            setShowCloudKeyModal(true);
            return; // Don't proceed with enabling encryption until key is loaded
          }
          // Otherwise generate a new key
          console.log('Generating new encryption key');
          key = await generateEncryptionKey();
          await storeEncryptionKey(key);
        }
        
        console.log('Setting encryption key and enabling encryption');
        setEncryptionKey(key);
        setIsEncryptionEnabled(true);
        localStorage.setItem('encryption_enabled', 'true');
        
        // Show cloud key modal when encryption is enabled and no cloud key exists
        if (!hasCloudKey) {
          console.log('No cloud key exists, showing modal');
          setShowCloudKeyModal(true);
        }
      } else {
        // Disable encryption - decrypt all existing notes first
        console.log('Disabling encryption and decrypting notes');
        const user = auth.currentUser;
        if (user && encryptionKey) {
          const notesRef = collection(db, 'notes');
          const q = query(notesRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          // Decrypt all notes
          for (const docSnapshot of querySnapshot.docs) {
            const note = docSnapshot.data();
            if (note.content?.startsWith('encrypted:')) {
              try {
                const encryptedContent = note.content.replace('encrypted:', '');
                const decryptedContent = await decryptData(encryptedContent, encryptionKey);
                if (decryptedContent) {
                  // Update the note with decrypted content
                  await updateDoc(doc(db, 'notes', docSnapshot.id), {
                    content: decryptedContent
                  });
                }
              } catch (error) {
                console.error('Error decrypting note:', error);
              }
            }
          }
        }
        
        console.log('Setting encryption state to disabled');
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

        // Force re-render of notes by triggering a state update
        const notesRef = collection(db, 'notes');
        const q = query(notesRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        // Re-encrypt notes with the loaded key
        for (const docSnapshot of querySnapshot.docs) {
          const note = docSnapshot.data();
          if (note.content?.startsWith('encrypted:')) {
            try {
              const encryptedContent = note.content.replace('encrypted:', '');
              const decryptedContent = await decryptData(encryptedContent, cloudKey);
              if (decryptedContent) {
                // Re-encrypt with the new key
                const newEncryptedContent = await encryptData(decryptedContent, cloudKey);
                await updateDoc(doc(db, 'notes', docSnapshot.id), {
                  content: `encrypted:${newEncryptedContent}`
                });
              }
            } catch (error) {
              console.error('Error re-encrypting note:', error);
            }
          }
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading key from cloud:', error);
      return false;
    }
  };

  // New function to change cloud key password
  const changeCloudKeyPassword = async (oldPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user || !encryptionKey) {
        throw new Error('User must be logged in and encryption key must exist');
      }

      // First verify the old password by attempting to load the key
      const verifiedKey = await getKeyFromCloud(user.uid, oldPassword);
      if (!verifiedKey) {
        throw new Error('Current password is incorrect');
      }

      // Store the key with the new password
      const success = await changeKeyPassword(user.uid, encryptionKey, oldPassword, newPassword);
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error changing cloud key password:', error);
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
        loadKeyFromCloud,
        changeCloudKeyPassword,
        showCloudKeyModal,
        setShowCloudKeyModal
      }}
    >
      {children}
    </EncryptionContext.Provider>
  );
}; 