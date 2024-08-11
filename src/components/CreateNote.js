// src/components/CreateNote.js

import React from 'react';
import './CreateNote.css';

const CreateNote = ({ onCreate }) => {
  const handleClick = () => {
    onCreate();
  };

  return (
    <div className="create-note" onClick={handleClick}>
      <h3>Create Note...</h3>
    </div>
  );
};

export default CreateNote;
