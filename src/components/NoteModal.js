import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NoteEditor from './NoteEditor';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, title, content, onSave }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedTitle(title);
    setEditedContent(content);
  }, [title, content]);

  const handleSave = () => {
    onSave(editedTitle, editedContent);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Note"
      className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Edit Note</h2>
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Note Title"
        />
        <NoteEditor
          initialContent={editedContent}
          onChange={(content) => setEditedContent(content)}
        />
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="btn btn-primary mr-2">
            Save
          </button>
          <button onClick={onRequestClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NoteModal;
