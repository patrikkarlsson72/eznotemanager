// src/components/GoogleSignIn.js
import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const GoogleSignIn = () => {
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in: ", result.user);
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
    }
  };

  return (
    <button 
      className="bg-blue-500 text-white p-2 rounded" 
      onClick={handleSignIn}
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
