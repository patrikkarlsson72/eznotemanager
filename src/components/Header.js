import React from 'react';

const Header = ({ onSearchChange, searchQuery, triggerNewNote }) => {
  return (
    <header className="bg-gray-700 text-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">EzNotemanager</h1>
        <div className="ml-auto flex items-center space-x-4">
          <button className="text-yellow-400" onClick={triggerNewNote}>
            New Note
          </button>
        </div>
      </div>
      {/* Right-aligned Smaller Search Bar */}
      <div className="flex justify-end mt-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="p-2 border border-gray-300 rounded bg-gray-700 text-white w-64"  // Adjust width as needed
        />
      </div>
    </header>
  );
};

export default Header;
