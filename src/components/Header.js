import React from 'react';
import logo from '../assets/EzNoteManagerlogo2.png'; // Ensure the path to the logo image is correct

const Header = ({ 
  onSearchChange, 
  searchQuery = '', 
  searchFilter = 'title', 
  setSearchFilter, 
  onClearFilters, 
  triggerNewNote, 
  setSelectedTag, 
  setSelectedCategory 
}) => {

  const handleClearFilters = () => {
    onSearchChange('');        // Clear the search query
    setSearchFilter('title');  // Reset the search filter to default ('title')
    setSelectedTag(null);      // Clear the selected tag filter
    setSelectedCategory('All Notes'); // Reset the selected category to default
  };

  return (
    <header className="bg-transparent text-white p-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-4" />
        <h1 className="font-sans text-2xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>
      </div>

      <div className="flex flex-col items-center flex-1">
        <div className="flex w-full max-w-lg">
          <button
            onClick={handleClearFilters}
            className="p-1 text-sm rounded bg-red-600 text-white hover:bg-red-500 mr-2"
          >
            Clear Filters
          </button>
          <input
            type="text"
            placeholder={`Search notes by ${searchFilter.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded bg-gray-700 text-white w-full"
          />
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="ml-2 p-1 text-sm border border-gray-300 rounded bg-gray-700 text-white"
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
            <option value="tags">Tags</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
      
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg text-xl"
        onClick={triggerNewNote}
      >
        + Add Note
      </button>
    </header>
  );
};

export default Header;

