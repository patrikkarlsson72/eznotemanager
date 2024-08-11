// src/components/ContentArea.js

import React from 'react';
import Note from './Note';
import CreateNote from './CreateNote';
import './ContentArea.css';

const ContentArea = () => {
  return (
    <div className="content-area">
      <CreateNote />
      <Note title="Note 1" color="#76c893" />
      <Note title="Note 2" color="#c597dd" />
    </div>
  );
};

export default ContentArea;
