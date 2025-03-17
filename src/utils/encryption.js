/**
 * Encryption utilities using Web Crypto API
 * Provides secure encryption/decryption of note content
 */

// Constants for encryption
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const STORAGE_KEY = 'note_encryption_key';

// Generate a new encryption key
async function generateEncryptionKey() {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: KEY_LENGTH,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
    return key;
  } catch (error) {
    console.error('Error generating encryption key:', error);
    throw new Error('Failed to generate encryption key');
  }
}

// Encrypt data using the provided key
async function encryptData(data, key) {
  try {
    // Generate random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Convert data to buffer
    const encodedData = new TextEncoder().encode(data);
    
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array([...iv, ...new Uint8Array(encryptedData)]);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data using the provided key
async function decryptData(encryptedData, key) {
  try {
    if (!key) {
      console.error('No encryption key provided for decryption');
      return null;
    }

    // Convert base64 to array buffer
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV from the beginning of the encrypted data
    const iv = encryptedBuffer.slice(0, 12);
    const data = encryptedBuffer.slice(12);

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Convert the decrypted array buffer back to text
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Store encryption key securely
async function storeEncryptionKey(key) {
  try {
    // Export key to raw format
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
    localStorage.setItem(STORAGE_KEY, keyBase64);
  } catch (error) {
    console.error('Error storing encryption key:', error);
    throw new Error('Failed to store encryption key');
  }
}

// Retrieve stored encryption key
async function getStoredEncryptionKey() {
  try {
    const storedKey = localStorage.getItem('note_encryption_key');
    if (!storedKey) return null;

    // Convert stored key back to CryptoKey
    const keyBuffer = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
    const key = await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Validate the key by attempting a test encryption
    try {
      const testData = new TextEncoder().encode('test');
      await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) },
        key,
        testData
      );
      return key;
    } catch (error) {
      console.error('Key validation failed:', error);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving encryption key:', error);
    return null;
  }
}

// Check if encryption is enabled
function isEncryptionEnabled() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

export {
  generateEncryptionKey,
  encryptData,
  decryptData,
  storeEncryptionKey,
  getStoredEncryptionKey,
  isEncryptionEnabled
}; 