import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);

  const triggerNewNote = () => {
    setCreateNoteTrigger(true);  // This will trigger the creation of a new note
  };

  return (
    <div className="bg-gray-100 flex-1">
      <Header
        onSearchChange={setSearchQuery}  // Pass the search query handler
        searchQuery={searchQuery}  // Pass the current search query
        triggerNewNote={triggerNewNote}  // Pass the function to trigger new note creation
      />
      <div className="flex">
        <Sidebar onCategorySelect={setSelectedCategory} />
        <ContentArea
          createNoteTrigger={createNoteTrigger}
          setCreateNoteTrigger={setCreateNoteTrigger}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}  // Pass the search query to ContentArea
        />
      </div>
    </div>
  );
}

export default App;
