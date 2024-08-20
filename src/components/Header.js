import React from 'react';

const Header = ({ onSearchChange, searchQuery = '', searchFilter = 'title', setSearchFilter, onClearFilters }) => {
  return (
    <header className="bg-transparent text-white p-4">
      <div className="flex flex-col items-center">
        <h1 className="font-sans text-2xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span>
        </h1>

        <div className="flex w-full max-w-lg mt-4">
          <input
            type="text"
            placeholder={`Search notes by ${searchFilter.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="p-2 border border-gray-300 rounded bg-gray-700 text-white w-full"
          />
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="ml-2 p-2 border border-gray-300 rounded bg-gray-700 text-white"
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
            <option value="tags">Tags</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Clear Filter Button */}
        <button
          onClick={onClearFilters}
          className="mt-2 p-2 rounded bg-red-600 text-white hover:bg-red-500"
        >
          Clear Filters
        </button>
      </div>
    </header>
  );
};

export default Header;
