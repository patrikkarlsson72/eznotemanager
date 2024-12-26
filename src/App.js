import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { 
  subscribeToUserTags, 
  subscribeToUserCategories, 
  updateUserCategories,
  initializeNewUser,
  getNotes
} from './firebase/notes';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TagManager from './components/TagManager';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LandingPage from './components/LandingPage';
import WelcomeGuide from './components/WelcomeGuide';

import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All Notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showTagManager, setShowTagManager] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState([]);
  const [createNoteTrigger, setCreateNoteTrigger] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [user, loading] = useAuthState(auth);

  // Subscribe to user's tags
  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      unsubscribe = subscribeToUserTags(user.uid, (updatedTags) => {
        console.log('Received updated tags:', updatedTags);
        setTags(updatedTags || []);
      });
    } else {
      setTags([]);
    }

    return () => unsubscribe();
  }, [user]);

  // Subscribe to user's categories
  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      unsubscribe = subscribeToUserCategories(user.uid, (updatedCategories) => {
        console.log('Received updated categories:', updatedCategories);
        setCategories(updatedCategories || []);
      });
    } else {
      setCategories([]);
    }

    return () => unsubscribe();
  }, [user]);

  const handleUpdateCategories = async (newCategories) => {
    if (user) {
      try {
        await updateUserCategories(user.uid, newCategories);
      } catch (error) {
        console.error('Error updating categories:', error);
      }
    }
  };

  const triggerNewNote = () => {
    setCreateNoteTrigger(true);
  };

  const handleTagSelect = (tag) => {
    if (tag === null) {
      setSelectedTag([]);
    } else {
      setSelectedTag(prev => {
        if (prev.includes(tag)) {
          return prev.filter(t => t !== tag);
        } else {
          return [...prev, tag];
        }
      });
    }
  };

  const handleCategorySelect = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory('All Notes');
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Handle new user setup and welcome guide
  useEffect(() => {
    const setupNewUser = async () => {
      if (user) {
        try {
          console.log('Attempting to initialize user:', user.uid);
          // Wait for categories and tags subscriptions to be set up
          await new Promise(resolve => setTimeout(resolve, 1000));
          const isNewUser = await initializeNewUser(user.uid);
          
          // Show welcome guide for new users
          if (isNewUser) {
            setShowWelcomeGuide(true);
          }
          
          // Force a refresh of notes after initialization
          const updatedNotes = await getNotes(user.uid);
          setNotes(updatedNotes);
        } catch (error) {
          console.error('Error setting up new user:', error);
        }
      }
    };

    if (user && !loading) {
      setupNewUser();
    }
  }, [user, loading]);

  // Check if user is new and show welcome guide
  useEffect(() => {
    const checkNewUser = async () => {
      if (user) {
        const isNewUser = await initializeNewUser(user.uid);
        if (isNewUser) {
          setShowWelcomeGuide(true);
        } else {
          setShowWelcomeGuide(false);
        }
      }
    };
    checkNewUser();
  }, [user]);

  const handleCloseWelcomeGuide = () => {
    setShowWelcomeGuide(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

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
          setCategories={handleUpdateCategories}
          onCategorySelect={handleCategorySelect}
          notes={notes}
          setNotes={setNotes}
          tags={tags}
          setShowTagManager={setShowTagManager}
          onTagSelect={handleTagSelect}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
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
          tags={tags}
        />
      </div>
      <Footer />
      <CookieConsent />
      {showTagManager && (
        <TagManager
          tags={tags}
          setTags={setTags}
          setShowTagManager={setShowTagManager}
          userId={user?.uid}
        />
      )}
      {showWelcomeGuide && (
        <WelcomeGuide onClose={handleCloseWelcomeGuide} />
      )}
    </div>
  );
}

export default App;