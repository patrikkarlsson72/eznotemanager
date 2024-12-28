import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDQnJHbZcL8QCkHJqVF2VPOr1lWYiDJ_Ow",
  authDomain: "eznotemanager-95745.firebaseapp.com",
  projectId: "eznotemanager-95745",
  storageBucket: "eznotemanager-95745.appspot.com",
  messagingSenderId: "1043517900865",
  appId: "1:1043517900865:web:c0e5c7c9c6c6e8c6c6c6e8"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 