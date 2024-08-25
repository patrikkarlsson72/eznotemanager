import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faTrash, faThumbtack, faImage } from '@fortawesome/free-solid-svg-icons';

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

  // Function to render the content and check for images
  const renderContent = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;

    // Select all images in the content
    const images = div.querySelectorAll('img');
    const containsImage = images.length > 0;

    if (containsImage) {
      images.forEach((img) => {
        img.classList.add('w-1/2', 'h-auto', 'max-h-32'); // Tailwind classes to constrain image width to 50% of the container while keeping the aspect ratio and limiting height
        img.style.maxWidth = '50%'; // Ensures the image doesn’t exceed 50% of the container's width
        img.style.objectFit = 'cover'; // Cover to maintain the aspect ratio
      });
    }

    return { 
      __html: div.innerHTML, 
      containsImage 
    };
  };

  const contentResult = renderContent(content);

  return (
    <div
      className={`p-4 rounded shadow-sm border border-gray-300 w-full h-64 relative overflow-hidden ${color} ${isPinned ? 'ring-4 ring-yellow-500' : ''}`}
    >
      <h3 className="text-lg font-semibold text-center relative" style={{ left: '0rem' }}>{title}</h3>
      
      {/* Image Indicator */}
      {contentResult.containsImage && (
        <FontAwesomeIcon icon={faImage} className="absolute bottom-0 left-0 p-2 text-gray-500" title="This note contains an image" />
      )}

      {/* Text and Image Preview */}
      <div
        className="text-base text-gray-700 overflow-hidden"  // Limit the overall content and ensure no overflow
        style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: '6', // Show up to 6 lines of text
          WebkitBoxOrient: 'vertical', 
          lineHeight: '1.2em', 
          maxHeight: '7.2em'  // 1.2em line height * 6 lines = 7.2em
        }}
        dangerouslySetInnerHTML={contentResult}  // Render HTML content with image resizing
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
