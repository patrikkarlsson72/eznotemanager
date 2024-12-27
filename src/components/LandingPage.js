import React from 'react';
import { signInWithGoogle } from '../firebase/auth';

const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 text-white">
      {/* Header with Sign In */}
      <div className="w-full flex justify-end items-center p-4">
        <button
          onClick={signInWithGoogle}
          className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-md mr-4"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold mb-2">
          Welcome to <span className="text-yellow-400">EzNote</span>Manager
        </h1>
        <p className="text-xl mb-12">
          Your personal space for organizing thoughts, ideas, and tasks with ease.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-folder"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Organize with Categories</h3>
            <p>Create custom categories with colors to keep your notes organized and easily accessible.</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-tags"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Tag System</h3>
            <p>Add tags to your notes and filter them instantly. Drag and drop tags for quick organization.</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-thumbtack"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Pin Important Notes</h3>
            <p>Keep your most important notes at the top by pinning them for quick access.</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Powerful Search</h3>
            <p>Find any note instantly with our powerful search feature. Search by title, content, or tags.</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-archive"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Archive System</h3>
            <p>Keep your workspace clean by archiving notes you don't need right now.</p>
          </div>

          <div className="bg-blue-900 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">
              <i className="fas fa-cloud"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
            <p>Your notes are securely stored in the cloud and accessible from any device.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Get Started Now</h2>
          <p className="mb-6">Join now and experience the best way to manage your notes. It's free!</p>
          <button
            onClick={signInWithGoogle}
            className="flex items-center bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors mx-auto shadow-md"
          >
            <GoogleIcon />
            Sign up with Google
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 mt-12">
        <p>© 2024 EzNoteManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;