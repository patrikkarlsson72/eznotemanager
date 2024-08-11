// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Add more services as needed

const firebaseConfig = {

    apiKey: "AIzaSyAoIv9mG_BnzyAZTf9FDL4b2hnodNOxiiA",
  
    authDomain: "ezprojects-ac732.firebaseapp.com",
  
    projectId: "ezprojects-ac732",
  
    storageBucket: "ezprojects-ac732.appspot.com",
  
    messagingSenderId: "66169473204",
  
    appId: "1:66169473204:web:fe76ba84678ad43f37afe1",
  
    measurementId: "G-D71Z7FECCZ"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
