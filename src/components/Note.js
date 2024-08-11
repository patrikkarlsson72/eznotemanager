import React from 'react';

const Note = ({ title, color, content, onDelete }) => {
  const previewContent = content.length > 100 ? `${content.substring(0, 100)}...` : content;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the parent
    onDelete(); // Call the delete function
  };

  return (
    <div
      className="bg-white shadow-md rounded-md w-full h-64 p-4 relative"
      style={{
        backgroundColor: color,
      }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{previewContent}</p>
      <button
        onClick={handleDeleteClick}  // Ensure the delete function is triggered correctly
        className="absolute top-0 right-0 p-1 text-xl"
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default Note;
