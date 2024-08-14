import React from 'react';

const Header = ({ onCreateNote }) => {
  return (
    <header className="bg-gray-900 text-white flex items-center p-4">
      <h1 className="text-xl font-bold">EzNotemanager</h1>
      <div className="ml-auto flex items-center space-x-4">
        <button 
          className="text-yellow-400 hover:underline" 
          onClick={onCreateNote}
        >
          New Note
        </button>
      </div>
    </header>
  );
};

export default Header;
