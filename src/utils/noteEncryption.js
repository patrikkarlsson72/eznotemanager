import { encryptData, decryptData } from './encryption';

// Encrypt note content if encryption is enabled
export const encryptNoteContent = async (content, encryptionKey) => {
  if (!content || !encryptionKey) return content;

  try {
    const encryptedContent = await encryptData(content, encryptionKey);
    console.log('Content encrypted successfully');
    return `encrypted:${encryptedContent}`;
  } catch (error) {
    console.error('Error encrypting note content:', error);
    return content;
  }
};

// Decrypt note content if it's encrypted
export const decryptNoteContent = async (content, encryptionKey) => {
  if (!content || !content.startsWith('encrypted:') || !encryptionKey) {
    return content;
  }

  try {
    const encryptedContent = content.replace('encrypted:', '');
    const decryptedContent = await decryptData(encryptedContent, encryptionKey);
    
    if (!decryptedContent) {
      throw new Error('Decryption resulted in empty content');
    }
    
    console.log('Content decrypted successfully');
    return decryptedContent;
  } catch (error) {
    console.error('Error decrypting note content:', error);
    return 'Error: Failed to decrypt content. Please check your encryption settings.';
  }
};

// Process note for display (decrypt if needed)
export const processNoteForDisplay = async (note, encryptionKey) => {
  if (!note) return note;

  const processedNote = { ...note };
  if (note.content) {
    processedNote.content = await decryptNoteContent(note.content, encryptionKey);
  }
  return processedNote;
};

// Process note for saving (encrypt if enabled)
export const processNoteForSaving = async (note, encryptionKey) => {
  if (!note) return note;

  const processedNote = { ...note };
  if (note.content) {
    processedNote.content = await encryptNoteContent(note.content, encryptionKey);
  }
  return processedNote;
}; 