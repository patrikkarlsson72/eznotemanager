import React from 'react';

const CreateNote = ({ onCreate }) => {
  const handleClick = () => {
    onCreate();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-yellow-300 hover:bg-yellow-400 text-black shadow-md rounded-md w-full h-64 flex items-center justify-center cursor-pointer"
    >
      <h3 className="text-xl">Create Note...</h3>
    </div>
  );
};

export default CreateNote;
