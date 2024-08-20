import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NoteEditor from './NoteEditor';

Modal.setAppElement('#root');

const NoteModal = ({ isOpen, onRequestClose, title, content, onSave, categories, selectedCategory, tags }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState(content);
  const [selectedCat, setSelectedCat] = useState(selectedCategory || 'Uncategorized');
  const [tagList, setTagList] = useState(tags || []);
  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]); // All tags available
  const [tagSuggestions, setTagSuggestions] = useState([]); // Filtered tag suggestions

  useEffect(() => {
    setEditedTitle(title || '');
    setEditedContent(content);
    setSelectedCat(selectedCategory || 'Uncategorized');
    setTagList(tags || []);

    // Load all tags from localStorage or backend
    const storedTags = JSON.parse(localStorage.getItem('tags')) || [];
    setAvailableTags(storedTags);
  }, [title, content, selectedCategory, tags]);

  useEffect(() => {
    if (newTag) {
      const suggestions = availableTags.filter(tag => 
        tag.toLowerCase().includes(newTag.toLowerCase()) && !tagList.includes(tag)
      );
      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  }, [newTag, availableTags, tagList]);

  const handleTitleFocus = () => {
    if (editedTitle === '') {
      setEditedTitle('');
    }
  };

  const handleSave = () => {
    const finalTitle = editedTitle.trim() === '' ? new Date().toLocaleDateString() : editedTitle;
    onSave(finalTitle, editedContent, selectedCat, tagList);
    onRequestClose();
  };

  const addTag = (tag) => {
    if (tag && !tagList.includes(tag)) {
      const updatedTags = [...tagList, tag];
      setTagList(updatedTags);
      setNewTag('');
      setTagSuggestions([]);

      // Add new tag to localStorage if it doesn't exist
      if (!availableTags.includes(tag)) {
        const updatedAvailableTags = [...availableTags, tag];
        setAvailableTags(updatedAvailableTags);
        localStorage.setItem('tags', JSON.stringify(updatedAvailableTags));
      }
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
          onFocus={handleTitleFocus}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder={new Date().toLocaleDateString()}
        />
        <NoteEditor
          initialContent={editedContent}
          onChange={(content) => setEditedContent(content)}
        />

        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            {categories
              .filter(category => category.name !== 'All Notes')
              .map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>

        <div className="mt-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Tags
  </label>
  <input
    type="text"
    value={newTag}
    onChange={(e) => setNewTag(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
    className="w-full p-2 mb-2 border border-gray-300 rounded"
    placeholder="Add a tag and press Enter"
  />
  {tagSuggestions.length > 0 && (
    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
      {tagSuggestions.map((suggestion, index) => (
        <li 
          key={index} 
          onClick={() => addTag(suggestion)}
          className="cursor-pointer hover:bg-gray-100 p-2"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
  <div className="flex flex-wrap gap-2 mt-2">
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
