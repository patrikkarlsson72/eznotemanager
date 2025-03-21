/**
 * Password-based encryption utilities using Web Crypto API
 * Provides secure encryption/decryption of individual notes with passwords
 */

// Constants for encryption
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 100000; // For password-based key derivation
const SALT_LENGTH = 16;
const ENCRYPTED_PREFIX = 'pw-encrypted:'; // Distinguish from the general encryption

/**
 * Derive an encryption key from a password
 * @param {string} password - The user-provided password
 * @param {Uint8Array} salt - Salt for key derivation (generate if not provided)
 * @returns {Object} - The derived key and the salt used
 */
export async function deriveKeyFromPassword(password, salt = null) {
  try {
    // Generate a random salt if not provided
    if (!salt) {
      salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    }

    // Convert password to a key using PBKDF2
    const passwordBuffer = new TextEncoder().encode(password);
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive the actual encryption key
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      baseKey,
      { name: ALGORITHM, length: KEY_LENGTH },
      true, // extractable
      ['encrypt', 'decrypt']
    );

    return { key: derivedKey, salt };
  } catch (error) {
    console.error('Error deriving key from password:', error);
    throw new Error('Failed to generate encryption key from password');
  }
}

/**
 * Encrypt data using a password
 * @param {string} data - The data to encrypt
 * @param {string} password - The password to use for encryption
 * @returns {string} - The encrypted data with salt and IV, Base64 encoded
 */
export async function encryptWithPassword(data, password) {
  try {
    // Derive key from password
    const { key, salt } = await deriveKeyFromPassword(password);
    
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
    
    // Combine salt, IV and encrypted data
    const combined = new Uint8Array([
      ...salt,                          // First 16 bytes: Salt
      ...iv,                            // Next 12 bytes: IV
      ...new Uint8Array(encryptedData)  // Remaining bytes: Encrypted data
    ]);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Error encrypting data with password:', error);
    throw new Error('Failed to encrypt data with password');
  }
}

/**
 * Decrypt data using a password
 * @param {string} encryptedData - The encrypted data in Base64 format
 * @param {string} password - The password to use for decryption
 * @returns {string} - The decrypted data
 */
export async function decryptWithPassword(encryptedData, password) {
  try {
    if (!encryptedData || typeof encryptedData !== 'string') {
      console.error('Invalid or missing encrypted data');
      return null;
    }
    
    if (!password || typeof password !== 'string') {
      console.error('Invalid or missing password');
      return null;
    }
    
    try {
      // Convert base64 to array buffer
      const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Check for minimum length (salt + IV + some data)
      if (encryptedBuffer.length <= SALT_LENGTH + 12) {
        console.error('Encrypted data is too short');
        return null;
      }
      
      // Extract salt, IV, and data
      const salt = encryptedBuffer.slice(0, SALT_LENGTH);
      const iv = encryptedBuffer.slice(SALT_LENGTH, SALT_LENGTH + 12);
      const data = encryptedBuffer.slice(SALT_LENGTH + 12);
      
      // Derive key from password and salt
      const { key } = await deriveKeyFromPassword(password, salt);
      
      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: ALGORITHM, iv },
        key,
        data
      );
      
      // Convert to text
      return new TextDecoder().decode(decryptedBuffer);
    } catch (decryptError) {
      console.error('Failed to decrypt with the provided password:', decryptError);
      return null;
    }
  } catch (error) {
    console.error('Error in password decryption process:', error);
    return null;
  }
}

/**
 * Check if content is encrypted with a password
 * @param {string} content - The content to check
 * @returns {boolean} - Whether the content is password-encrypted
 */
export function isPasswordEncrypted(content) {
  return content && typeof content === 'string' && content.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Encrypt note content with a password and prepare for storage
 * @param {string} content - The content to encrypt
 * @param {string} password - The password to use
 * @returns {string} - The prefixed encrypted content
 */
export async function encryptNoteWithPassword(content, password) {
  if (!content || !password) return content;
  
  try {
    const encryptedContent = await encryptWithPassword(content, password);
    return `${ENCRYPTED_PREFIX}${encryptedContent}`;
  } catch (error) {
    console.error('Error encrypting note with password:', error);
    return content; // Return original content on failure
  }
}

/**
 * Decrypt note content that was encrypted with a password
 * @param {string} content - The encrypted content (with prefix)
 * @param {string} password - The password to use
 * @returns {string} - The decrypted content
 */
export async function decryptNoteWithPassword(content, password) {
  if (!isPasswordEncrypted(content) || !password) {
    return content;
  }
  
  try {
    const encryptedPart = content.replace(ENCRYPTED_PREFIX, '');
    return await decryptWithPassword(encryptedPart, password);
  } catch (error) {
    console.error('Error decrypting note with password:', error);
    return 'Failed to decrypt content. The password may be incorrect.';
  }
} 