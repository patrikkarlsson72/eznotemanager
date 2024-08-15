import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);

  // Manage categories at the top level
  const [categories, setCategories] = useState([
    { name: 'All Notes', color: 'bg-lime-200' },
    { name: 'Work/Projects', color: 'bg-teal-200' },
    { name: 'Personal', color: 'bg-blue-200' },
    { name: 'Urgent', color: 'bg-red-500' },
    { name: 'Ideas', color: 'bg-yellow-200' },
    { name: 'Meetings', color: 'bg-blue-500' },
    { name: 'Uncategorized', color: 'bg-gray-300' }
  ]);

  // Load categories from localStorage when the component mounts
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const triggerNewNote = () => {
    setCreateNoteTrigger(true);  // This will trigger the creation of a new note
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 flex-1">
      <Header
        onSearchChange={setSearchQuery}  // Pass the search query handler
        searchQuery={searchQuery}  // Pass the current search query
        triggerNewNote={triggerNewNote}  // Pass the function to trigger new note creation
      />
      <div className="flex">
        <Sidebar 
          categories={categories}  // Pass the categories state to Sidebar
          setCategories={setCategories}  // Pass the setCategories function to Sidebar
          onCategorySelect={setSelectedCategory}  // Handle category selection
        />
        <ContentArea
          createNoteTrigger={createNoteTrigger}
          setCreateNoteTrigger={setCreateNoteTrigger}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}  // Pass the search query to ContentArea
          categories={categories}  // Pass the categories state to ContentArea
        />
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg text-xl"
        onClick={triggerNewNote}  // Trigger the creation of a new note
      >
        + Add Note
      </button>

    </div>
  );
}

export default App;
