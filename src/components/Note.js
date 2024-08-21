import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faTrash, faThumbtack } from '@fortawesome/free-solid-svg-icons';

const Note = ({ title, color, content, tags = [], onDelete, onArchive, onPin, isArchived, isPinned }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
    onArchive();
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPin();
  };

  // Function to render the content and adjust images
  const renderContent = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;

    // Select all images in the content
    const images = div.querySelectorAll('img');
    images.forEach((img) => {
      img.classList.add('max-w-full', 'h-auto', 'max-h-24'); // Tailwind classes to constrain image size
    });

    return { __html: div.innerHTML };
  };

  return (
    <div
      className={`p-4 rounded shadow-sm border border-gray-300 w-full h-64 relative ${color} ${isPinned ? 'ring-4 ring-yellow-500' : ''}`}
    >
      <h3 className="text-lg font-semibold text-center relative" style={{ left: '0rem' }}>{title}</h3>
      <div
        className="text-base text-gray-700 text-preview"
        dangerouslySetInnerHTML={renderContent(content)}  // Render HTML content with image resizing
      ></div>

      {/* Display Tags */}
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-0 right-0 p-1 text-xl"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        title="Delete"
      >
        <FontAwesomeIcon icon={faTrash} className="text-gray-600 hover:text-black" />
      </button>

      {/* Archive/Unarchive Button */}
      <button
        onClick={handleArchiveClick}
        className="absolute bottom-0 right-0 p-2 text-xl"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        title={isArchived ? "Unarchive" : "Archive"}
      >
        <FontAwesomeIcon icon={faBoxArchive} className="text-gray-600 hover:text-black" />
      </button>

      {/* Pin/Unpin Button */}
      <button
        onClick={handlePinClick}
        className="absolute top-0 left-0 p-2 text-xl"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
        title={isPinned ? "Unpin" : "Pin"}
      >
        <FontAwesomeIcon icon={faThumbtack} className={isPinned ? "text-yellow-500" : "text-gray-600"} />
      </button>
    </div>
  );
};

export default Note;