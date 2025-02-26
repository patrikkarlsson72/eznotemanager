import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faTrash, faThumbtack, faTag, faLock } from '@fortawesome/free-solid-svg-icons';
import { decryptData } from '../utils/encryption';
import { useTheme } from '../context/ThemeContext';
import { useEncryption } from '../context/EncryptionContext';

const Note = ({ title, color, content, tags = [], onDelete, onArchive, onPin, isArchived, isPinned, onDuplicate, onTagAdd, createdAt, updatedAt }) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const { theme } = useTheme();
  const { isEncryptionEnabled, encryptionKey } = useEncryption();
  const [decryptedContent, setDecryptedContent] = useState(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const decryptContent = async () => {
      if (content?.startsWith('encrypted:') && encryptionKey) {
        setIsDecrypting(true);
        try {
          const encryptedContent = content.replace('encrypted:', '');
          const decrypted = await decryptData(encryptedContent, encryptionKey);
          if (decrypted) {
            setDecryptedContent(decrypted);
          }
        } catch (error) {
          console.error('Error decrypting content:', error);
          setDecryptedContent(null);
        } finally {
          setIsDecrypting(false);
        }
      } else {
        setDecryptedContent(content);
      }
    };
    decryptContent();
  }, [content, encryptionKey]);

  const handleRightClick = (e) => {
    e.preventDefault();
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
    e.stopPropagation();
    setContextMenu({ visible: false, x: 0, y: 0 });
    onDelete();
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation();
    setContextMenu({ visible: false, x: 0, y: 0 });
    onDuplicate();
  };

  const handleArchiveClick = (e) => {
    e.stopPropagation();
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
    // Show loading state while decrypting
    if (isDecrypting) {
      return { __html: '<p class="text-gray-700">🔒 Decrypting...</p>' };
    }

    // Show placeholder for encrypted content that couldn't be decrypted
    if (content?.startsWith('encrypted:') && !decryptedContent) {
      return { __html: '<p class="text-gray-700">🔒 Encrypted content</p>' };
    }

    // Use decrypted content if available, otherwise use original content
    const contentToRender = decryptedContent || content;
    if (!contentToRender) return { __html: '' };

    const div = document.createElement('div');
    div.innerHTML = contentToRender;

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
      // Add lazy loading
      img.setAttribute('loading', 'lazy');
      
      // Add error handling with fallback
      img.setAttribute('onerror', "this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Crect width=\"40\" height=\"40\" fill=\"%23f0f0f0\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" font-family=\"Arial\" font-size=\"6\" fill=\"%23999\" text-anchor=\"middle\" dy=\".3em\"%3EImage failed to load%3C/text%3E%3C/svg%3E'");

      // Add existing styling
      img.classList.add('w-1/2', 'h-auto', 'max-h-32');
      img.style.maxWidth = '50%';
      img.style.objectFit = 'cover';
      
      // Add transition for smooth loading
      img.style.transition = 'opacity 0.3s ease-in-out';
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
    >
      <h3 className="text-lg font-semibold text-center relative" style={{ left: '0rem' }}>{title}</h3>
      
      {/* Timestamps */}
      <div className="flex justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-1 mb-2">
        <span>{createdAt?.toDate().toLocaleDateString()}</span>
        {updatedAt && updatedAt?.toDate() > createdAt?.toDate() && (
          <>
            <span>•</span>
            <span>Updated: {updatedAt.toDate().toLocaleDateString()}</span>
          </>
        )}
      </div>

      {/* Encryption Indicator */}
      {content?.startsWith('encrypted:') && (
        <div className="absolute top-1 right-8" title="Encrypted note">
          <FontAwesomeIcon icon={faLock} className="text-gray-600" />
        </div>
      )}

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
        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700" />
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
        <FontAwesomeIcon 
          icon={faBoxArchive} 
          className={`${isArchived ? 'text-blue-500 hover:text-blue-700' : 'text-gray-600 hover:text-blue-500'}`}
        />
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

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-lg py-2 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleArchiveClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faBoxArchive} className="mr-2" />
            {isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={handlePinClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
          >
            <FontAwesomeIcon icon={faThumbtack} className="mr-2" />
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={handleDuplicateClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Duplicate
          </button>
          <button
            onClick={handleDeleteClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Note;
