import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { encryptData, decryptData } from './encryption';

// Derive a key from the user's password
async function deriveKeyFromPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Use SHA-256 to create a hash of the password
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Import the hash as a CryptoKey
  return await crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Store the encrypted key in Firebase
export async function storeKeyInCloud(userId, encryptionKey, password) {
  try {
    // First, derive a key from the password
    const passwordKey = await deriveKeyFromPassword(password);
    
    // Export the encryption key to raw format
    const exportedKey = await crypto.subtle.exportKey('raw', encryptionKey);
    
    // Convert ArrayBuffer to Uint8Array for encryption
    const keyData = new Uint8Array(exportedKey);
    
    // Encrypt the encryption key with the password-derived key
    const encryptedKey = await encryptData(
      Array.from(keyData).join(','),  // Convert to string format
      passwordKey
    );
    
    // Store the encrypted key in Firebase
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      encryptedKey: encryptedKey,
      updatedAt: new Date()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error storing key in cloud:', error);
    return false;
  }
}

// Retrieve and decrypt the key from Firebase
export async function getKeyFromCloud(userId, password) {
  try {
    // Get the encrypted key from Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists() || !userDoc.data().encryptedKey) {
      return null;
    }
    
    // Derive the key from the password
    const passwordKey = await deriveKeyFromPassword(password);
    
    // Decrypt the encryption key
    const encryptedKey = userDoc.data().encryptedKey;
    const decryptedString = await decryptData(encryptedKey, passwordKey);
    
    // Convert the decrypted string back to Uint8Array
    const keyData = new Uint8Array(decryptedString.split(',').map(Number));
    
    // Import the decrypted key as a CryptoKey
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  } catch (error) {
    console.error('Error getting key from cloud:', error);
    return null;
  }
}

// Check if a cloud key exists for the user
export async function checkCloudKeyExists(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() && userDoc.data().encryptedKey ? true : false;
  } catch (error) {
    console.error('Error checking cloud key:', error);
    return false;
  }
} 