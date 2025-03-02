import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolder, 
  faTags, 
  faPen, 
  faMagnifyingGlass, 
  faLock, 
  faLaptop,
  faUser,
  faUserPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import EmailSignIn from './EmailSignIn';
import EmailSignUp from './EmailSignUp';
import appScreenshot from '../assets/app-screenshot.png';

const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const AuthModal = ({ isOpen, onClose, showSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {showSignIn ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-gray-300">
            {showSignIn 
              ? 'Welcome back! Please sign in to continue.' 
              : 'Create an account to get started.'}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon />
            {showSignIn ? 'Sign in with Google' : 'Sign up with Google'}
          </button>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {showSignIn ? <EmailSignIn /> : <EmailSignUp />}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = (isSignIn) => {
    setShowSignIn(isSignIn);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 text-white">
      {/* Header with Auth Options */}
      <div className="w-full flex justify-end items-center p-4 gap-4">
        <button
          onClick={() => openAuthModal(true)}
          className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 bg-transparent text-white border border-white hover:bg-white/10"
        >
          <FontAwesomeIcon icon={faUser} />
          Sign In
        </button>
        <button
          onClick={() => openAuthModal(false)}
          className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Sign Up
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">
            Welcome to <span className="text-yellow-400">EzNote</span>Manager<span className="text-blue-500">Pro</span>
          </h1>
          <p className="text-xl mb-4">
            Your personal space for organizing thoughts, ideas, and tasks with ease.
          </p>
          <button
            onClick={() => openAuthModal(false)}
            className="inline-block bg-gradient-to-r from-yellow-400/10 via-yellow-400/20 to-yellow-400/10 rounded-full px-6 py-2 mb-12 hover:from-yellow-400/20 hover:via-yellow-400/30 hover:to-yellow-400/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <p className="text-yellow-400 text-lg font-semibold">
              <span className="mr-2">✨</span>
              Free to use - Start organizing your notes today
              <span className="ml-2">✨</span>
            </p>
          </button>

          {/* App Screenshot Section */}
          <div className="mb-16 px-4">
            <div className="relative mx-auto max-w-6xl">
              {/* Multiple layered glows for more dramatic effect */}
              <div className="absolute -inset-0.5 bg-blue-500 opacity-30 blur-2xl rounded-lg transform rotate-2"></div>
              <div className="absolute -inset-1 bg-yellow-400 opacity-20 blur-2xl rounded-lg transform -rotate-1"></div>
              <div className="absolute -inset-1 bg-blue-600 opacity-20 blur-xl rounded-lg"></div>
              
              {/* Frame effect */}
              <div className="relative bg-gradient-to-br from-blue-900/50 via-transparent to-blue-900/50 p-2 rounded-xl backdrop-blur-sm">
                {/* Browser-like top bar */}
                <div className="bg-gray-900/80 rounded-t-lg p-3 flex items-center space-x-2 border-b border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Screenshot */}
                <img 
                  src={appScreenshot} 
                  alt="EzNoteManagerPro Interface" 
                  className="rounded-b-lg w-full shadow-2xl border border-gray-700/50"
                />
              </div>
            </div>
            
            {/* Enhanced caption */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-lg font-light">
                Clean, intuitive interface with powerful features at your fingertips
              </p>
              <p className="text-blue-400/80 text-sm mt-2">
                Organize, create, and manage your notes with professional tools
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faFolder} />
              </div>
              <h3 className="text-xl font-bold mb-2">Organize with Ease</h3>
              <p>Create categories, add tags, and keep your notes perfectly organized. Find what you need, when you need it.</p>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faTags} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Tagging</h3>
              <p>Tag your notes for quick reference and easy filtering. Create custom tags that work for your workflow.</p>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faPen} />
              </div>
              <h3 className="text-xl font-bold mb-2">Rich Text Editor</h3>
              <p>Write and format your notes with our powerful editor. Support for markdown, images, and file attachments.</p>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Search</h3>
              <p>Find any note instantly with our powerful search feature. Search through titles, content, and tags.</p>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faLock} />
              </div>
              <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
              <p>Keep your sensitive notes secure with optional end-to-end encryption. Only you can read your encrypted notes.</p>
            </div>

            <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
              <div className="text-yellow-400 text-3xl mb-4">
                <FontAwesomeIcon icon={faLaptop} />
              </div>
              <h3 className="text-xl font-bold mb-2">Work Anywhere</h3>
              <p>Access your notes from any device, work offline, and let everything sync automatically when you're back online.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-16">
          <p className="text-gray-400">© 2024 EzNoteManagerPro. All rights reserved.</p>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        showSignIn={showSignIn}
      />
    </div>
  );
};

export default LandingPage;