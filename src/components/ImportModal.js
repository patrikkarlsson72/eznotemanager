import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const ImportModal = ({ isOpen, onRequestClose, onImport }) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedNotes, setParsedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file || (!file.name.endsWith('.md') && !file.name.endsWith('.txt'))) {
      setError('Please select a valid Markdown (.md) or Text (.txt) file.');
      return;
    }

    setSelectedFile(file);
    setIsLoading(true);
    setError(null);

    try {
      const content = await file.text();
      const notes = file.name.endsWith('.md') 
        ? parseMarkdownContent(content)
        : parsePlainTextContent(content);
      setParsedNotes(notes);
    } catch (err) {
      setError('Failed to read file. Please make sure it is a valid text or Markdown file.');
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const parsePlainTextContent = (content) => {
    // Split by double newline to separate notes
    const sections = content.split(/\n\s*\n/).filter(Boolean);
    
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      // Try to detect categories and tags from the content
      let category = '';
      let tags = [];
      
      // Look for category indicators like "Category:", "Type:", "Group:"
      const categoryMatch = content.match(/^(Category|Type|Group):\s*([^\n]+)/i);
      if (categoryMatch) {
        category = categoryMatch[2].trim();
      }
      
      // Look for tag indicators like "Tags:", "Labels:", "#tag"
      const tagsMatch = content.match(/^Tags:\s*([^\n]+)/i);
      if (tagsMatch) {
        tags = tagsMatch[1].split(',').map(tag => tag.trim());
      } else {
        // Look for hashtags in the content
        const hashTags = content.match(/#[\w-]+/g);
        if (hashTags) {
          tags = hashTags.map(tag => tag.substring(1));
        }
      }
      
      return {
        title: title || 'Untitled Note',
        content: content || '',
        category,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
  };

  const parseMarkdownContent = (content) => {
    const notes = [];
    const sections = content.split('##').filter(Boolean);

    sections.forEach(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      
      let category = '';
      let tags = [];
      let contentStart = 1;

      // Parse metadata (category and tags)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('Category:')) {
          category = line.replace('Category:', '').trim();
          contentStart = i + 1;
        } else if (line.startsWith('Tags:')) {
          tags = line.replace('Tags:', '')
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
          contentStart = i + 1;
        } else if (line !== '') {
          break;
        }
      }

      const noteContent = lines.slice(contentStart).join('\n').trim();
      
      if (title && noteContent) {
        notes.push({
          title,
          content: noteContent,
          category,
          tags,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    });

    return notes;
  };

  const handleImport = () => {
    if (parsedNotes.length > 0) {
      onImport(parsedNotes);
      // Clear all state
      setSelectedFile(null);
      setParsedNotes([]);
      setError(null);
      // Reset the file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      onRequestClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Import Notes"
      className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg w-[800px] max-w-full mx-auto`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div>
        <h2 className={`text-2xl font-semibold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Import Notes
        </h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
              : theme === 'light'
                ? 'border-gray-300'
                : 'border-gray-600'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".md,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className={`flex flex-col items-center cursor-pointer ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}
          >
            <FontAwesomeIcon 
              icon={isLoading ? faSpinner : faFileImport} 
              className={`text-4xl mb-2 ${isLoading ? 'animate-spin' : ''} ${
                isDragging ? 'text-blue-500' : ''
              }`}
            />
            <span className={`text-lg font-medium ${isDragging ? 'text-blue-500' : ''}`}>
              {selectedFile ? selectedFile.name : isDragging 
                ? 'Drop your file here'
                : 'Choose a Markdown or Text file'
              }
            </span>
            <span className={`text-sm mt-1 ${isDragging ? 'text-blue-500' : ''}`}>
              or drag and drop it here
            </span>
            <span className={`text-xs mt-2 ${
              isDragging 
                ? 'text-blue-400'
                : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Supported formats: .md, .txt
            </span>
          </label>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {parsedNotes.length > 0 && (
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Preview ({parsedNotes.length} notes found)
            </h3>
            <div className={`border rounded-lg p-4 max-h-64 overflow-y-auto ${
              theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
            }`}>
              {parsedNotes.map((note, index) => (
                <div
                  key={index}
                  className={`p-3 ${index > 0 ? 'border-t' : ''} ${
                    theme === 'light' ? 'border-gray-200' : 'border-gray-700'
                  }`}
                >
                  <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                    {note.title}
                  </h4>
                  {note.category && (
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Category: {note.category}
                    </p>
                  )}
                  {note.tags.length > 0 && (
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Tags: {note.tags.join(', ')}
                    </p>
                  )}
                  <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    {note.content.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </button>
          {parsedNotes.length > 0 && (
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Import {parsedNotes.length} notes
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal; 