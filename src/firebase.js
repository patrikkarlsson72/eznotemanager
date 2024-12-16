import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAJt9QW45zTLthE3GkP2bppg1haDh9pZOo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "eznotemanager-95745.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "eznotemanager-95745",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "eznotemanager-95745.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "962686545344",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:962686545344:web:55ec5e9a26cdbf3726ac25"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
