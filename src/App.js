import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TagManager from './components/TagManager';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [selectedTag, setSelectedTag] = useState(null);
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);

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

  // Manage notes at the top level
  const [notes, setNotes] = useState([]);

  // Manage tags at the top level
  const [tags, setTags] = useState([]);

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

  // Load notes from localStorage when the component mounts
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  // Load tags from localStorage when the component mounts
  useEffect(() => {
    const storedTags = JSON.parse(localStorage.getItem('tags'));
    if (storedTags) {
      setTags(storedTags);
    }
  }, []);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  const triggerNewNote = () => {
    setCreateNoteTrigger(true);  // This will trigger the creation of a new note
  };

  const handleTagSelect = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Toggle off if the same tag is clicked
    } else {
      setSelectedTag(tag);
    }
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
          notes={notes}  // Pass notes to Sidebar
          setNotes={setNotes}  // Pass setNotes function to Sidebar
          tags={tags}  // Pass the tags state to Sidebar
          setShowTagManager={setShowTagManager}  // Handle showing the Tag Manager
          onTagSelect={handleTagSelect}  // Handle tag selection
        />
        <ContentArea
          createNoteTrigger={createNoteTrigger}
          setCreateNoteTrigger={setCreateNoteTrigger}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}  // Pass the search query to ContentArea
          categories={categories}  // Pass the categories state to ContentArea
          notes={notes}  // Pass notes to ContentArea
          setNotes={setNotes}  // Pass setNotes to ContentArea if needed
          selectedTag={selectedTag}  // Pass selected tag to ContentArea
        />
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full shadow-lg text-xl"
        onClick={triggerNewNote}  // Trigger the creation of a new note
      >
        + Add Note
      </button>

      {showTagManager && (
        <TagManager
          tags={tags}
          setTags={setTags}
          onClose={() => setShowTagManager(false)}  // Close Tag Manager
        />
      )}
    </div>
  );
}

export default App;