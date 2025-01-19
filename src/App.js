// External imports
import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Modal from 'react-modal';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

// Firebase and Context imports
import { auth } from './firebase';
import { useTheme } from './context/ThemeContext';
import { EncryptionProvider } from './context/EncryptionContext';
import { ThemeProvider } from './context/ThemeContext';
import { 
  subscribeToUserTags, 
  subscribeToUserCategories, 
  updateUserCategories,
  initializeNewUser,
  getNotes,
  addNote,
  subscribeToNotes
} from './firebase/notes';

// Component imports
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TagManager from './components/TagManager';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LandingPage from './components/LandingPage';
import WelcomeGuide from './components/WelcomeGuide';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ImportModal from './components/ImportModal';

// Styles
import './App.css';

// Set up Modal
Modal.setAppElement('#root');

function App() {
  const { theme, toggleTheme, themes } = useTheme();
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
  const [selectedNote, setSelectedNote] = useState(null);
  const [user, loading] = useAuthState(auth);
  const searchInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // Subscribe to user's notes
  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      unsubscribe = subscribeToNotes(user.uid, (updatedNotes) => {
        console.log('Received updated notes:', updatedNotes);
        setNotes(updatedNotes || []);
      });
    } else {
      setNotes([]);
    }

    return () => unsubscribe();
  }, [user]);

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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchFilter('title');
    setSelectedTag([]);
    setSelectedCategory('All Notes');
  };

  // Add keyboard shortcut handlers
  const handleCreateNote = () => {
    setCreateNoteTrigger(true);
  };

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      console.log('Attempting to save note...');
      // Try to find the save button using multiple strategies
      const saveButton = 
        document.querySelector('button.note-save-button') ||  // Primary selector
        document.querySelector('button.bg-blue-500') ||  // Backup selector
        Array.from(document.querySelectorAll('button')).find(button => {
          const text = button.textContent.trim().toLowerCase();
          return text === 'save';
        });
      
      if (saveButton) {
        console.log('Save button found:', saveButton);
        saveButton.click();
        return true;
      }

      console.warn('Save button not found. Available buttons:', 
        Array.from(document.querySelectorAll('button'))
          .map(b => ({
            text: b.textContent.trim(),
            class: b.className,
            type: b.type,
            id: b.id
          }))
      );
      return false;
    }
    console.warn('No note selected for saving');
    return false;
  };

  const handleCloseModal = () => {
    if (selectedNote) {
      setSelectedNote(null);
    }
  };

  const handleExport = async (format, selectedNotes) => {
    console.log('Starting export process...');
    const notesToExport = selectedNotes || notes;
    
    if (!notesToExport || notesToExport.length === 0) {
      console.log('No notes to export');
      return;
    }

    console.log('Processing notes for export:', notesToExport);

    try {
      if (format === 'markdown') {
        // Create a temporary div for HTML to Markdown conversion
        const tempDiv = document.createElement('div');
        let markdownContent = '# My Notes\n\n';
        
        notesToExport.forEach((note, index) => {
          // Add note title
          markdownContent += `## ${note.title}\n\n`;
          
          // Add metadata in a Markdown-friendly format
          if (note.category) {
            markdownContent += `**Category:** ${note.category}\n\n`;
          }
          if (note.tags && note.tags.length > 0) {
            markdownContent += `**Tags:** ${note.tags.join(', ')}\n\n`;
          }
          
          // Convert HTML content to plain text while preserving basic formatting
          tempDiv.innerHTML = note.content;
          
          // Process lists
          const lists = tempDiv.querySelectorAll('ul, ol');
          lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach(item => {
              const prefix = list.tagName === 'OL' ? '1. ' : '- ';
              item.textContent = `${prefix}${item.textContent}\n`;
            });
          });
          
          // Process headings
          const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach(heading => {
            const level = heading.tagName[1];
            heading.textContent = `${'#'.repeat(level)} ${heading.textContent}\n\n`;
          });
          
          // Process paragraphs
          const paragraphs = tempDiv.querySelectorAll('p');
          paragraphs.forEach(p => {
            p.textContent = `${p.textContent}\n\n`;
          });
          
          // Process links
          const links = tempDiv.querySelectorAll('a');
          links.forEach(link => {
            link.textContent = `[${link.textContent}](${link.href})`;
          });
          
          // Process images
          const images = tempDiv.querySelectorAll('img');
          images.forEach(img => {
            img.outerHTML = `![${img.alt || 'image'}](${img.src})\n\n`;
          });
          
          // Add the processed content
          markdownContent += `${tempDiv.textContent}\n`;
          
          // Add separator between notes
          if (index < notesToExport.length - 1) {
            markdownContent += '\n---\n\n';
          }
        });

        console.log('Created markdown content, attempting to save...');
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent));
        element.setAttribute('download', `my_notes_${new Date().toISOString().split('T')[0]}.md`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        console.log('Markdown file download initiated');
      } 
      else if (format === 'pdf') {
        console.log('Starting PDF generation with html2pdf...');
        
        // Create a temporary container for the HTML content
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.fontFamily = 'Roboto, sans-serif';
        container.style.color = '#000000'; // Ensure dark text color

        // Add each note's content to the container
        notesToExport.forEach((note, index) => {
          const noteDiv = document.createElement('div');
          noteDiv.style.marginBottom = '30px';
          noteDiv.style.pageBreakAfter = index < notesToExport.length - 1 ? 'always' : 'auto';
          noteDiv.style.position = 'relative'; // Enable proper positioning

          // Add title
          const title = document.createElement('h1');
          title.textContent = note.title;
          title.style.fontSize = '24px';
          title.style.marginBottom = '10px';
          title.style.color = '#000000';
          title.style.fontWeight = 'bold';
          noteDiv.appendChild(title);

          // Add metadata (category and tags)
          if (note.category || (note.tags && note.tags.length)) {
            const metadata = document.createElement('div');
            metadata.style.marginBottom = '15px';
            metadata.style.color = '#333333';
            metadata.style.fontSize = '14px';

            if (note.category) {
              const category = document.createElement('div');
              category.textContent = `Category: ${note.category}`;
              metadata.appendChild(category);
            }

            if (note.tags && note.tags.length) {
              const tags = document.createElement('div');
              tags.textContent = `Tags: ${note.tags.join(', ')}`;
              metadata.appendChild(tags);
            }

            noteDiv.appendChild(metadata);
          }

          // Add content with proper styling
          const content = document.createElement('div');
          content.innerHTML = note.content;
          content.style.color = '#000000';
          content.style.lineHeight = '1.6';
          content.style.position = 'relative';
          content.style.zIndex = '1';
          
          // Style all images within the content
          const images = content.getElementsByTagName('img');
          Array.from(images).forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '90%';
            img.style.height = 'auto';
            img.style.marginTop = '20px';
            img.style.marginBottom = '20px';
            img.style.marginLeft = 'auto';
            img.style.marginRight = 'auto';
            img.style.pageBreakInside = 'avoid';
          });

          // Style all paragraphs and text elements
          const paragraphs = content.getElementsByTagName('p');
          Array.from(paragraphs).forEach(p => {
            p.style.color = '#000000';
            p.style.marginBottom = '10px';
            p.style.position = 'relative';
          });

          // Style lists and list items
          const lists = content.querySelectorAll('ul, ol');
          Array.from(lists).forEach(list => {
            list.style.paddingLeft = '40px';
            list.style.marginBottom = '15px';
            list.style.marginTop = '15px';
            list.style.position = 'relative';
            
            if (list.tagName === 'UL') {
              list.style.listStyle = 'disc';
            } else if (list.tagName === 'OL') {
              list.style.listStyle = 'decimal';
            }
          });

          const listItems = content.getElementsByTagName('li');
          Array.from(listItems).forEach((li, index) => {
            li.style.color = '#000000';
            li.style.marginBottom = '8px';
            li.style.paddingLeft = '5px';
            
            // Fix the alignment by using flexbox
            li.style.display = 'flex';
            li.style.alignItems = 'flex-start';
            
            // Create a marker for the bullet/number
            const marker = document.createElement('span');
            marker.style.minWidth = '25px';
            marker.style.marginLeft = '-25px';
            marker.style.marginRight = '5px';
            
            if (li.parentElement.tagName === 'OL') {
              marker.textContent = `${index + 1}.`;
              li.style.listStyle = 'none';
            } else {
              marker.textContent = '•';
              li.style.listStyle = 'none';
            }
            
            // Wrap the content
            const content = document.createElement('span');
            content.innerHTML = li.innerHTML;
            li.innerHTML = '';
            
            li.appendChild(marker);
            li.appendChild(content);
          });

          noteDiv.appendChild(content);
          container.appendChild(noteDiv);
        });

        // Configure html2pdf options
        const opt = {
          margin: [15, 15],
          filename: `my_notes_${new Date().toISOString().split('T')[0]}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        };

        // Generate PDF
        html2pdf().set(opt).from(container).save()
          .then(() => {
            console.log('PDF generation completed');
          })
          .catch(error => {
            console.error('Error generating PDF:', error);
          });
      }
    } catch (error) {
      console.error('Error in export process:', error);
    }
  };

  const handleImport = async (importedNotes) => {
    if (!user) return;
    
    try {
      // Import each note
      for (const note of importedNotes) {
        await addNote({
          ...note,
          userId: user.uid,
          order: notes.length + 1000,
          isArchived: false,
          pinned: false,
          category: note.category || 'Uncategorized',
          tags: note.tags || []
        });
      }
    } catch (error) {
      console.error('Error importing notes:', error);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themes[theme].background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <EncryptionProvider>
      <div className={`min-h-screen ${themes[theme].background} ${theme === 'dark' ? 'dark' : ''} flex flex-col relative`}>
        <KeyboardShortcuts
          onCreateNote={handleCreateNote}
          onFocusSearch={handleFocusSearch}
          onSaveNote={handleSaveNote}
          onCloseModal={handleCloseModal}
          isModalOpen={!!selectedNote}
        />
        <Header
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          onClearFilters={handleClearFilters}
          triggerNewNote={() => setCreateNoteTrigger(true)}
          setSelectedTag={setSelectedTag}
          setSelectedCategory={setSelectedCategory}
          searchInputRef={searchInputRef}
          onExport={handleExport}
          onImport={() => setShowImportModal(true)}
          notes={notes}
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
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            onExport={handleExport}
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
        <ImportModal
          isOpen={showImportModal}
          onRequestClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      </div>
    </EncryptionProvider>
  );
}

export default App;