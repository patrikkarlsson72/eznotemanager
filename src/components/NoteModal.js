import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Draggable from 'react-draggable';
import TipTapEditor from './TipTapEditor';
import { useTheme } from '../context/ThemeContext';
import { encryptData, decryptData } from '../utils/encryption';
import { useEncryption } from '../context/EncryptionContext';

const NoteModal = ({ isOpen, onRequestClose, title: initialTitle, content: initialContent, onSave, categories, selectedCategory, tags: initialTags = [], availableTags = [], onExport }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [selectedCat, setSelectedCat] = useState(selectedCategory || 'Uncategorized');
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const { theme } = useTheme();
  const { isEncryptionEnabled, encryptionKey } = useEncryption();

  useEffect(() => {
    const loadContent = async () => {
      console.log('NoteModal content updated:', { initialTitle, initialContent });
      setEditedTitle(initialTitle || '');
      try {
        // Decrypt content if it's encrypted
        if (initialContent?.startsWith('encrypted:') && encryptionKey) {
          const encryptedContent = initialContent.replace('encrypted:', '');
          const decryptedContent = await decryptData(encryptedContent, encryptionKey);
          if (!decryptedContent) {
            throw new Error('Decryption resulted in empty content');
          }
          console.log('Content decrypted successfully');
          setEditedContent(decryptedContent || '');
        } else {
          setEditedContent(initialContent || '');
        }
      } catch (error) {
        console.error('Error decrypting content:', error);
        setEditedContent('Error: Failed to decrypt content. Please check your encryption settings.');
      }
      setSelectedCat(selectedCategory || 'Uncategorized');
      setTagList(initialTags || []);
    };
    loadContent();
  }, [initialTitle, initialContent, selectedCategory, initialTags, encryptionKey]);

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

  const handleSave = async () => {
    const finalTitle = editedTitle.trim() === '' ? new Date().toLocaleDateString() : editedTitle;
    try {
      // Encrypt content if encryption is enabled
      let finalContent = editedContent;
      if (isEncryptionEnabled && encryptionKey) {
        const encryptedContent = await encryptData(editedContent, encryptionKey);
        finalContent = `encrypted:${encryptedContent}`;
      }
      console.log('Saving note:', { finalTitle, finalContent, selectedCat, tagList });
      onSave(finalTitle, finalContent, selectedCat, tagList);
      onRequestClose();
    } catch (error) {
      console.error('Error encrypting content:', error);
    }
  };

  const handleContentChange = (newContent) => {
    console.log('Content changed:', newContent);
    setEditedContent(newContent);
  };

  const addTag = (tag) => {
    if (tag && !tagList.includes(tag)) {
      const updatedTags = [...tagList, tag];
      setTagList(updatedTags);
      setNewTag('');
      setTagSuggestions([]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  const handleExportCurrentNote = (format) => {
    if (onExport) {
      const currentNote = {
        id: Date.now().toString(),
        title: editedTitle,
        content: editedContent,
        category: selectedCat,
        tags: tagList
      };
      onExport(format, [currentNote]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Draggable handle=".modal-drag-handle" bounds="parent">
        <div className={`w-full max-w-4xl ${
          theme === 'light'
            ? 'bg-white'
            : 'bg-gray-800'
        } rounded-lg shadow-xl max-h-[90vh] flex flex-col`}>
          <div className="modal-drag-handle p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-move">
            <h2 className={`text-xl font-bold ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              {initialTitle ? 'Edit Note' : 'Create Note'}
            </h2>
            <button
              onClick={onRequestClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onFocus={handleTitleFocus}
                  placeholder="Note Title"
                  className={`w-full p-2 border rounded ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-800'
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}
                />
              </div>

              <div>
                <TipTapEditor
                  content={editedContent}
                  onChange={handleContentChange}
                  onExport={(format) => handleExportCurrentNote(format)}
                />
              </div>

              <div>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-800'
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}
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

              <div>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
                  placeholder="Add a tag and press Enter"
                  className={`w-full p-2 border rounded ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-800'
                      : 'bg-gray-700 border-gray-600 text-white'
                  }`}
                />
                <div className="relative">
                  {tagSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1 w-64">
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
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagList.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-2 text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={onRequestClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100
                    dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="note-save-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default NoteModal;
