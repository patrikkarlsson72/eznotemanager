// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Add more services as needed

const firebaseConfig = {
  // You'll need to replace these with your Firebase project config values
  apiKey: "AIzaSyAJt9QW45zTLthE3GkP2bppg1haDh9pZOo",
  authDomain: "eznotemanager-95745.firebaseapp.com",
  projectId: "eznotemanager-95745",
  storageBucket: "eznotemanager-95745.firebasestorage.app",
  messagingSenderId: "962686545344",
  appId: "1:962686545344:web:55ec5e9a26cdbf3726ac25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

export default app;
