// src/components/NoteModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, title, content, onSave }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedTitle, editedContent);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Note"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '350px',
        },
      }}
    >
      <h2>Edit Note</h2>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px', fontSize: '18px' }}
        placeholder="Note Title"
      />
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        style={{ width: '100%', height: '150px', padding: '8px' }}
        placeholder="Note Content"
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default NoteModal;
