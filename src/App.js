import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TagManager from './components/TagManager';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import HelpFaqModal from './components/HelpFaqModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [selectedTag, setSelectedTag] = useState(null);
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [isHelpFaqOpen, setIsHelpFaqOpen] = useState(false); // State to control Help/FAQ modal

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
    <div id="top" className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 flex flex-col">
  
      <Header
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        triggerNewNote={triggerNewNote}
        setSelectedTag={setSelectedTag}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex flex-1 overflow-hidden">
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
      <Footer onHelpFaqClick={() => setIsHelpFaqOpen(true)} /> {/* Pass the Help/FAQ click handler */}

      {/* Cookie Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="I understand"
        cookieName="myAwesomeCookieName"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        This website uses cookies to enhance the user experience.{" "}
        <span style={{ fontSize: "10px" }}>Learn more about cookies.</span>
      </CookieConsent>

      {showTagManager && (
        <TagManager
          tags={tags}
          setTags={setTags}
          setShowTagManager={setShowTagManager}
        />
      )}

      {/* Help/FAQ Modal */}
      <HelpFaqModal 
        isOpen={isHelpFaqOpen} 
        onRequestClose={() => setIsHelpFaqOpen(false)} 
      />
    </div>
  );
}

export default App;