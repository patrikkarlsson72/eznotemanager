// src/components/NoteModal.js

import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, content, onSave }) => {
  const [editedContent, setEditedContent] = React.useState(content);

  const handleSave = () => {
    onSave(editedContent);
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
          height: '300px',
        },
      }}
    >
      <h2>Edit Note</h2>
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        style={{ width: '100%', height: '200px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default NoteModal;
