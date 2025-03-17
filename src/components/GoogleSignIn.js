// src/components/GoogleSignIn.js
import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this site to sign in with Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center gap-2 min-w-[200px]"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      ) : (
        <>
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          Sign in with Google
        </>
      )}
    </button>
  );
};

export default GoogleSignIn;
