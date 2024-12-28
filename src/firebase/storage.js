import { storage } from './index';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file, userId) => {
  try {
    console.log('Starting image upload process...', { userId });
    
    // Create a unique filename using timestamp
    const timestamp = new Date().getTime();
    const filename = `${userId}/images/${timestamp}_${file.name}`;
    console.log('Generated filename:', filename);
    
    const storageRef = ref(storage, filename);
    console.log('Created storage reference');

    // Upload the file
    console.log('Uploading file...');
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot);
    
    // Get the download URL
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Got download URL:', downloadURL);
    
    return downloadURL;
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

    // Upload the file
    console.log('Uploading file...');
    const snapshot = await uploadBytes(storageRef, file);
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