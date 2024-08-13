// src/components/Sidebar.js

import React from 'react';

const Sidebar = () => {
  return (
    <aside class="bg-gray-700 text-gray-300 w-64 p-4">
    <nav class="space-y-2">
        <a href="#" class="block p-2 rounded bg-blue-500 text-white">Dashboard</a>
        <a href="#" class="block p-2 rounded hover:bg-gray-600 text-gray-300">My Notes</a>
        
    </nav>
</aside>
  );
};

export default Sidebar;
