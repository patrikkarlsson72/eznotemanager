import React from 'react';

const Note = ({ title, color, content, onDelete }) => {
  // Strip HTML tags from the content to create a clean text preview
  const previewContent = content.replace(/<[^>]+>/g, '').substring(0, 100);

  // Extract image URLs from the content for preview
  const imgRegex = /<img.*?src="(.*?)"/g;
  let imgMatch;
  const imageUrls = [];

  while ((imgMatch = imgRegex.exec(content)) !== null) {
    imageUrls.push(imgMatch[1]);
  }

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
      <p className="text-sm text-gray-600">{previewContent}...</p>
      {imageUrls.length > 0 && (
        <div className="mt-2">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="Note preview"
              className="h-12 w-12 object-cover mr-2 inline-block"
            />
          ))}
        </div>
      )}
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
