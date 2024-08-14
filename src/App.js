import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

function App() {
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Notes'); // Default to showing all notes

  const handleCreateNote = () => {
    setCreateNoteTrigger(true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-gray-100 flex-1">
      <Header onCreateNote={handleCreateNote} />
      <div className="flex">
        <Sidebar onCategorySelect={handleCategorySelect} />
        <ContentArea 
          createNoteTrigger={createNoteTrigger} 
          setCreateNoteTrigger={setCreateNoteTrigger} 
          selectedCategory={selectedCategory} 
        />
      </div>
    </div>
  );
}

export default App;
