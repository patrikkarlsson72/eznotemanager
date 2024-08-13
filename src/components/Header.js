// src/components/Header.js

import React from 'react';
//import './Header.css'; // You'll define styles in this CSS file

const Header = () => {
  return (
    <header className="bg-gray-900 text-white flex items-center p-4">
      <h1 className="text-xl font-bold">EzNotemanager</h1>
      <div class="ml-auto flex items-center space-x-4">
      <button class="text-yellow-400">New Note</button>
      </div>
    </header>
  );
};

export default Header;
