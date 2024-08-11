// src/components/CreateNote.js

import React from 'react';

const CreateNote = ({ onCreate }) => {
  const handleClick = () => {
    onCreate();
  };

  return (
    <div
  onClick={handleClick}
  className="bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded cursor-pointer w-96 h-80 flex items-center justify-center"
>
  <h3 className="text-xl">Create Note...</h3>
</div>

  );
};

export default CreateNote;
