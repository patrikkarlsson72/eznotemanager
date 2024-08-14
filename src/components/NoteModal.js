import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NoteEditor from './NoteEditor';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, title, content, onSave, categories, selectedCategory }) => {
  const [editedTitle, setEditedTitle] = useState(title || '');
  const [editedContent, setEditedContent] = useState(content);
  const [selectedCat, setSelectedCat] = useState(selectedCategory || 'Uncategorized');

  useEffect(() => {
    setEditedTitle(title || '');
    setEditedContent(content);
    setSelectedCat(selectedCategory || 'Uncategorized');
  }, [title, content, selectedCategory]);

  // Generate today's date in the desired format
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSave = () => {
    const titleToSave = editedTitle.trim() === '' ? today : editedTitle;
    onSave(titleToSave, editedContent, selectedCat);
    onRequestClose();
  };

  // Filter out the "All Notes" category
  const availableCategories = categories.filter(category => category.name !== 'All Notes');

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
          placeholder={today}  // Use today's date as the placeholder
        />
        <NoteEditor
          initialContent={editedContent}
          onChange={(content) => setEditedContent(content)}
        />

        {/* Category Selection */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            {availableCategories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>

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
