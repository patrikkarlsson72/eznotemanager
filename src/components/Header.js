import React from 'react';

const Header = ({ onSearchChange, searchQuery }) => {
  return (
    <header className="bg-transparent text-white p-4">
      {/* Centered App Name and Search Bar */}
      <div className="flex flex-col items-center">
        {/* App Name */}
        <h1 className="font-sans text-2xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>

        {/* Centered Search Bar */}
        <div className="w-full max-w-lg mt-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-2 border border-gray-300 rounded bg-gray-700 text-white w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
