# End-to-End Encryption Feature Documentation

## Overview
This document describes the implementation of end-to-end encryption for notes in EzNoteManagerPro. The feature allows users to encrypt their notes' content before saving to Firebase and decrypt them when viewing/editing.

## Implementation Details

### Components and Files
1. `src/context/EncryptionContext.js`
   - Manages the global encryption state
   - Provides `isEncryptionEnabled` state and `toggleEncryption` function
   - Uses React Context for state management

2. `src/utils/encryption.js`
   - Core encryption utilities using Web Crypto API
   - Functions:
     - `generateEncryptionKey()`: Creates new encryption key
     - `encryptData()`: Encrypts data using AES-GCM
     - `decryptData()`: Decrypts encrypted data
     - `storeEncryptionKey()`: Stores key in localStorage
     - `getStoredEncryptionKey()`: Retrieves key from localStorage
     - `isEncryptionEnabled()`: Checks if encryption is enabled

3. `src/utils/noteEncryption.js`
   - High-level note encryption utilities
   - Functions:
     - `encryptNoteContent()`: Encrypts note content if encryption is enabled
     - `decryptNoteContent()`: Decrypts encrypted note content
     - `processNoteForDisplay()`: Processes note for display
     - `processNoteForSaving()`: Processes note for saving

4. `src/components/EncryptionSettings.js`
   - UI component for toggling encryption
   - Located in the hamburger menu
   - Shows current encryption status

### Encryption Process
1. When encryption is enabled:
   - New notes are encrypted before saving to Firebase
   - Content is prefixed with "encrypted:" to mark it as encrypted
   - Notes are automatically decrypted when opened for editing

2. Data Flow:
   ```
   Saving: Raw Content → Encrypt → Save to Firebase
   Loading: Firebase → Decrypt → Display in Editor
   ```

### Technical Implementation
1. Encryption Algorithm: AES-GCM (256-bit)
2. Key Storage: Browser's localStorage
3. Data Format: Base64 encoded encrypted data with IV

### User Experience
1. Users can toggle encryption from the hamburger menu
2. Encrypted notes show a lock icon in the preview
3. Encryption status is preserved between sessions
4. Seamless encryption/decryption during note operations

## Usage Example
```javascript
// Encrypting content
const encryptedContent = await encryptNoteContent(rawContent);

// Decrypting content
const decryptedContent = await decryptNoteContent(encryptedContent);
```

## Security Considerations
1. Encryption key is stored locally in the browser
2. Uses Web Crypto API for secure cryptographic operations
3. Encrypted data is only decrypted when needed
4. No plaintext content is stored in Firebase

## Future Improvements
1. Add encryption key backup/recovery mechanism
2. Implement key rotation
3. Add option to encrypt note titles
4. Add visual indicator for encryption strength 

## Known Issues and Solutions

### 1. Encryption State Persistence
**Issue**: After turning off encryption and refreshing the page, encryption would automatically re-enable if an encryption key existed in localStorage.

**Solution**: 
- Added separate storage for encryption preference using `localStorage.setItem('encryption_enabled', 'true/false')`
- Modified `EncryptionContext.js` to check both the key existence AND user preference during initialization
- Updated the `toggleEncryption` function to store the user's preference

```javascript
// In EncryptionContext.js
const initializeEncryption = async () => {
  const key = await getStoredEncryptionKey();
  const storedPreference = localStorage.getItem('encryption_enabled');
  const shouldEnableEncryption = storedPreference === 'true';
  
  if (key) {
    setEncryptionKey(key);
    setIsEncryptionEnabled(shouldEnableEncryption); // Respects user preference
  }
};
```

This ensures that the encryption state remains consistent with the user's last choice, even after page refreshes.

### 2. Raw Encrypted Content Display
**Issue**: When opening encrypted notes, sometimes the raw encrypted content would be displayed instead of the decrypted content.

**Solution**:
- Added proper decryption handling in the note preview and editor components
- Implemented loading states during decryption
- Added visual indicators (lock icon) for encrypted notes
- Ensured decryption is performed before displaying note content

## Best Practices
1. Always preserve the encryption key even when encryption is disabled
2. Store user preferences separately from encryption keys
3. Provide clear visual feedback about encryption status
4. Handle decryption errors gracefully with user-friendly messages 