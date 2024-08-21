import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TagManager from './components/TagManager';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title'); // Add this line
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [selectedTag, setSelectedTag] = useState(null);
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);

  const [categories, setCategories] = useState([
    { name: 'All Notes', color: 'bg-lime-200' },
    { name: 'Work/Projects', color: 'bg-teal-200' },
    { name: 'Personal', color: 'bg-blue-200' },
    { name: 'Urgent', color: 'bg-red-500' },
    { name: 'Ideas', color: 'bg-yellow-200' },
    { name: 'Meetings', color: 'bg-blue-500' },
    { name: 'Uncategorized', color: 'bg-gray-300' }
  ]);

  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories'));
    if (storedCategories) {
      setCategories(storedCategories);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const storedTags = JSON.parse(localStorage.getItem('tags'));
    if (storedTags) {
      setTags(storedTags);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const triggerNewNote = () => {
    setCreateNoteTrigger(true);
  };

  const handleTagSelect = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 flex-1">
      <Header
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        searchFilter={searchFilter} // Pass the current search filter
        setSearchFilter={setSearchFilter} // Pass the function to set search filter
        triggerNewNote={triggerNewNote}
      />
      <div className="flex">
        <Sidebar 
          categories={categories}
          setCategories={setCategories}
          onCategorySelect={setSelectedCategory}
          notes={notes}
          setNotes={setNotes}
          tags={tags}
          setShowTagManager={setShowTagManager}
          onTagSelect={handleTagSelect}
        />
        <ContentArea
          createNoteTrigger={createNoteTrigger}
          setCreateNoteTrigger={setCreateNoteTrigger}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          categories={categories}
          notes={notes}
          setNotes={setNotes}
          selectedTag={selectedTag}
        />
      </div>
      <button
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg text-xl"
        onClick={triggerNewNote}
      >
        + Add Note
      </button>

      {showTagManager && (
        <TagManager
          tags={tags}
          setTags={setTags}
          setShowTagManager={setShowTagManager}
        />
      )}
    </div>
  );
}

export default App;
