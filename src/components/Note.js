import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faTrash, faThumbtack, faTag } from '@fortawesome/free-solid-svg-icons';

const Note = ({ title, color, content, tags = [], onDelete, onArchive, onPin, isArchived, isPinned, onDuplicate, onTagAdd }) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const contextMenuRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleClickOutside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent element
    setContextMenu({ visible: false, x: 0, y: 0 });
    onDelete();
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent element
    setContextMenu({ visible: false, x: 0, y: 0 });
    onDuplicate(); // Call the duplicate function
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the parent element
    onArchive();
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onPin();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const tag = e.dataTransfer.getData('text/plain');
    if (tag && !tags.includes(tag) && onTagAdd) {
      onTagAdd(tag);
    }
  };

  const renderContent = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;

    // Add text color class to all text elements
    const textElements = div.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote');
    textElements.forEach((element) => {
      element.classList.add('text-gray-700');
    });

    const links = div.querySelectorAll('a');
    links.forEach((link) => {
      // Make the link open in a new tab
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer'); // Security measure

      // Automatically add 'http://' if not present
      if (!link.href.startsWith('http')) {
        link.href = `http://${link.href}`;
      }

      // Stop event propagation when a link is clicked
      link.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the note container
        event.preventDefault(); // Prevent the note opening logic entirely
        window.open(link.href, '_blank'); // Open the link in a new tab manually
      });

      link.classList.add('text-blue-500', 'underline', 'hover:text-orange-500', 'hover:no-underline');
    });

    const images = div.querySelectorAll('img');
    images.forEach((img) => {
      img.classList.add('w-1/2', 'h-auto', 'max-h-32');
      img.style.maxWidth = '50%';
      img.style.objectFit = 'cover';
    });

    return { __html: div.innerHTML };
  };

  return (
    <div
      className={`p-4 rounded shadow-sm border border-gray-300 w-full h-64 relative overflow-hidden ${color} ${isPinned ? 'ring-4 ring-yellow-500' : ''} ${isDragOver ? 'ring-2 ring-blue-500' : ''}`}
      onContextMenu={handleRightClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        if (e.target.tagName !== 'A') {
          // Your logic to open the note
        }
      }}
    >
      <h3 className="text-lg font-semibold text-center relative" style={{ left: '0rem' }}>{title}</h3>
      
      <div
        className="text-base text-gray-700 overflow-hidden"
        style={{ display: '-webkit-box', WebkitLineClamp: '6', WebkitBoxOrient: 'vertical', lineHeight: '1.2em', maxHeight: '7.2em' }}
        dangerouslySetInnerHTML={renderContent(content)}
      ></div>

      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
            <FontAwesomeIcon icon={faTag} className="mr-1" />
            {tag}
          </span>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
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

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
          className="custom-context-menu bg-white shadow-lg rounded-md p-2 absolute"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={handleDuplicateClick}
          >
            Duplicate Note
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={handleDeleteClick}
          >
            Delete Note
          </li>
        </ul>
      )}
    </div>
  );
};

export default Note;
