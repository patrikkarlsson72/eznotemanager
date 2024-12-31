import { storage } from './index';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Helper function to ensure correct storage URL format
const getCorrectStorageUrl = (url) => {
  return url.replace('appspot.com', 'firebasestorage.app');
};

export const uploadImage = async (file, userId) => {
  try {
    const auth = getAuth();
    console.log('Current auth state:', {
      isAuthenticated: !!auth.currentUser,
      currentUserId: auth.currentUser?.uid,
      requestedUserId: userId,
      isMatching: auth.currentUser?.uid === userId
    });

    console.log('Starting image upload process...', { userId });
    
    // Create a unique filename using timestamp
    const timestamp = new Date().getTime();
    const filename = `${userId}/images/${timestamp}_${file.name}`;
    console.log('Generated filename:', filename);
    
    const storageRef = ref(storage, filename);
    console.log('Created storage reference');

    // Upload the file with basic metadata
    console.log('Uploading file...');
    const metadata = {
      contentType: file.type
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('File uploaded successfully:', snapshot);
    
    // Get the download URL and ensure correct format
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    const correctedURL = getCorrectStorageUrl(downloadURL);
    console.log('Got download URL:', correctedURL);
    
    return correctedURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadFile = async (file, userId) => {
  try {
    console.log('Starting file upload process...', { userId });
    
    // Create a unique filename using timestamp
    const timestamp = new Date().getTime();
    const filename = `${userId}/files/${timestamp}_${file.name}`;
    console.log('Generated filename:', filename);
    
    const storageRef = ref(storage, filename);
    console.log('Created storage reference');

    // Upload the file with basic metadata
    console.log('Uploading file...');
    const metadata = {
      contentType: file.type
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('File uploaded successfully:', snapshot);
    
    // Get the download URL
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Got download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}; 