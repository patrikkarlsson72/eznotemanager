import React, { useState } from 'react';

const TagManager = ({ tags, setTags, setShowTagManager }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      localStorage.setItem('tags', JSON.stringify(updatedTags)); // Persist to localStorage
      setNewTag('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTag(); // Call addTag when Enter is pressed
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    localStorage.setItem('tags', JSON.stringify(updatedTags)); // Persist to localStorage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Manage Tags</h2>

        {/* Scrollable Tag List */}
        <div className="mb-4 max-h-96 overflow-y-auto">
          {tags.map((tag, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded mb-2">
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Tag */}
        <div className="mb-4">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}  // Add the keydown event listener here
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Add new tag"
          />
          <button
            onClick={addTag}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Add Tag
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowTagManager(false)}  // Close the Tag Manager
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagManager;
