import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faBoxArchive, faThumbtack, faSearch, faFolder } from '@fortawesome/free-solid-svg-icons';
import GoogleSignIn from './GoogleSignIn';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to EzNote<span className="text-yellow-500">Manager</span>
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Your personal space for organizing thoughts, ideas, and tasks with ease.
        </p>
        <div className="mb-12">
          <GoogleSignIn />
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <FeatureCard
          icon={faFolder}
          title="Organize with Categories"
          description="Create custom categories with colors to keep your notes organized and easily accessible."
        />
        <FeatureCard
          icon={faTag}
          title="Tag System"
          description="Add tags to your notes and filter them instantly. Drag and drop tags for quick organization."
        />
        <FeatureCard
          icon={faThumbtack}
          title="Pin Important Notes"
          description="Keep your most important notes at the top by pinning them for quick access."
        />
        <FeatureCard
          icon={faSearch}
          title="Powerful Search"
          description="Find any note instantly with our powerful search feature. Search by title, content, or tags."
        />
        <FeatureCard
          icon={faBoxArchive}
          title="Archive System"
          description="Keep your workspace clean by archiving notes you don't need right now."
        />
        <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg backdrop-blur-sm border border-blue-700">
          <h3 className="text-2xl font-semibold mb-4">Get Started Now</h3>
          <p className="text-gray-300 mb-6">
            Join now and experience the best way to manage your notes. It's free!
          </p>
          <GoogleSignIn />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 border-t border-blue-800">
        <p>© 2024 EzNoteManager. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg backdrop-blur-sm border border-blue-700 transform hover:scale-105 transition-transform duration-200">
    <FontAwesomeIcon icon={icon} className="text-4xl text-yellow-500 mb-4" />
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default LandingPage; 