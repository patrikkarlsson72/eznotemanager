import React from 'react';

const Note = ({ title, color, content, onDelete }) => {
  const previewContent = content.replace(/<[^>]+>/g, '').substring(0, 100);
  const imgRegex = /<img.*?src="(.*?)"/g;
  let imgMatch;
  const imageUrls = [];

  while ((imgMatch = imgRegex.exec(content)) !== null) {
    imageUrls.push(imgMatch[1]);
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={`p-4 rounded shadow-sm border border-gray-300 w-full h-64 relative ${color}`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-700">{previewContent}...</p>
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
        onClick={handleDeleteClick}
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
