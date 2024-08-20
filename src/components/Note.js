import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faTrash } from '@fortawesome/free-solid-svg-icons';

const Note = ({ title, color, content, tags = [], onDelete, onArchive, isArchived }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
    onArchive();
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
      className={`p-4 rounded shadow-sm border border-gray-300 w-full h-64 relative ${color}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
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
        className="absolute top-0 right-0 p-1 text-xl group"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faTrash} className="text-gray-600 hover:text-black" />
        <span className="absolute right-0 top-full mt-1 hidden group-hover:block bg-black text-white text-lg rounded py-1 px-2">
          Delete
        </span>
      </button>

      {/* Archive/Unarchive Button */}
      <button
        onClick={handleArchiveClick}
        className="absolute bottom-0 right-0 p-2 text-xl group"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={faBoxArchive} className="text-gray-600 hover:text-black" />
        <span className="absolute right-0 bottom-full mb-1 hidden group-hover:block bg-black text-white text-lg rounded py-1 px-2">
          {isArchived ? "Unarchive" : "Archive"}
        </span>
      </button>
    </div>
  );
};

export default Note;
