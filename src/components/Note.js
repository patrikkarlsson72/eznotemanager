// src/components/Note.js

import React from 'react';
import './Note.css';

const Note = ({ title, color, content }) => {
  const previewContent = content.length > 100 ? `${content.substring(0, 100)}...` : content;

  return (
    <div
      className="note"
      style={{ backgroundColor: color, width: '150px', height: '150px', padding: '10px', boxSizing: 'border-box' }}
    >
      <h3>{title}</h3>
      <p>{previewContent}</p>
    </div>
  );
};

export default Note;
