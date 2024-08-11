// src/components/Sidebar.js

import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul>
        <li>All</li>
        <li>General</li>
        <li>Testing</li>
        <li>Adminstuff</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
