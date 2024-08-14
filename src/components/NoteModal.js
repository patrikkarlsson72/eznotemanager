import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NoteEditor from './NoteEditor';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, title, content, onSave, categories, selectedCategory, tags }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [selectedCat, setSelectedCat] = useState(selectedCategory || 'Uncategorized');
  const [tagList, setTagList] = useState(tags || []); // Initialize tags here
  const [newTag, setNewTag] = useState(''); // State for the new tag input

  useEffect(() => {
    setEditedTitle(title);
    setEditedContent(content);
    setSelectedCat(selectedCategory || 'Uncategorized');
    setTagList(tags || []);  // Initialize tags state here
  }, [title, content, selectedCategory, tags]);

  const handleSave = () => {
    onSave(editedTitle, editedContent, selectedCat, tagList); // Pass tags along with title and content
    onRequestClose();
  };

  const addTag = () => {
    if (newTag && !tagList.includes(newTag)) {
      setTagList([...tagList, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
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
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>

        {/* Tag Input */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tags
          </label>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}  // Add tag on Enter key
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Add a tag and press Enter"
          />
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 text-red-500">x</button>
              </span>
            ))}
          </div>
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
