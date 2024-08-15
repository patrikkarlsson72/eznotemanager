import React from 'react';

const Header = ({ onSearchChange, searchQuery, triggerNewNote }) => {
  return (
    <header className="bg-transperant text-white p-4">
      <div className="flex items-center justify-between">
      <h1 class="font-sans text-2xl font-bold">EzNote<span class="text-yellow-500">Manager</span></h1>
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
