// src/components/Note.js

import React from 'react';
import './Note.css';

const Note = ({ title, color }) => {
  return (
    <div className="note" style={{ backgroundColor: color }}>
      <h3>{title}</h3>
    </div>
  );
};

export default Note;
