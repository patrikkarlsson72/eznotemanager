import React, { useState } from 'react';
import { updateUserTags, removeUserTag } from '../firebase/notes';

const TagManager = ({ tags, setTags, setShowTagManager, userId }) => {
  const [newTag, setNewTag] = useState('');

  const addTag = async () => {
    if (newTag.trim() !== '' && !tags.includes(newTag) && userId) {
      try {
        await updateUserTags(userId, [...tags, newTag]);
        setNewTag('');
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTag();
    }
  };

  const removeTagHandler = async (tagToRemove) => {
    if (userId) {
      try {
        await removeUserTag(userId, tagToRemove);
      } catch (error) {
        console.error('Error removing tag:', error);
      }
    }
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
                onClick={() => removeTagHandler(tag)}
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
            onKeyDown={handleKeyDown}
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
            onClick={() => setShowTagManager(false)}
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
