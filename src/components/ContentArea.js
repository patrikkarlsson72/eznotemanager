import React, { useState, useEffect, useRef } from 'react';
import Note from './Note';
import NoteModal from './NoteModal';
import './ContentArea.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addNote, updateNote, deleteNote, subscribeToNotes, getNotes } from '../firebase/notes';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ContentArea = ({ createNoteTrigger, setCreateNoteTrigger, selectedCategory, searchQuery, categories, notes, setNotes, selectedTag }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, noteId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contextMenuRef = useRef(null);
  const [user, userLoading] = useAuthState(auth);

  // Subscribe to notes updates
  useEffect(() => {
    let unsubscribe = () => {};
    
    const setupSubscription = async () => {
      try {
        if (!user) {
          console.log("No user logged in");
          setNotes([]);
          setLoading(false);
          return;
        }

        console.log("Setting up subscription for user:", user.uid);
        
        // Initial fetch
        const initialNotes = await getNotes(user.uid);
        setNotes(initialNotes);
        
        // Set up real-time subscription
        unsubscribe = subscribeToNotes(user.uid, (updatedNotes) => {
          console.log("Received notes update:", updatedNotes.length);
          setNotes(updatedNotes);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error setting up notes subscription:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    setupSubscription();
    return () => unsubscribe();
  }, [user, setNotes]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
      // You might want to show an error notification to the user here
    }
  }, [error]);

  // Handle right-click to display custom context menu
  const handleRightClick = (event, noteId) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent triggering the onClick event
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      noteId: noteId,
    });
  };

  // Function to hide the custom context menu
  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, noteId: null });
  };

  // Close the context menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };
    
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  // Handle the create note trigger
  useEffect(() => {
    if (createNoteTrigger) {
      createNote();
      setCreateNoteTrigger(false); // Reset the trigger
    }
  }, [createNoteTrigger, setCreateNoteTrigger]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedNotes = Array.from(notes);
    const [movedNote] = reorderedNotes.splice(source.index, 1);
    reorderedNotes.splice(destination.index, 0, movedNote);

    setNotes(reorderedNotes);
  };

  const createNote = async () => {
    closeContextMenu();
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in to create notes');
      return;
    }

    const newNote = {
      userId: user.uid,
      title: '',
      content: '',
      color: '#ADD8E6',
      category: 'Uncategorized',
      tags: [],
      isArchived: false,
      pinned: false
    };
    setSelectedNote(newNote);
  };

  const saveNoteContent = async (newTitle, newContent, newCategory, newTags) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Please sign in to save notes');
        return;
      }

      const noteData = {
        userId: user.uid,
        title: newTitle || new Date().toLocaleDateString(),
        content: newContent,
        category: newCategory,
        tags: newTags,
        isArchived: selectedNote.isArchived || false,
        pinned: selectedNote.pinned || false
      };

      if (selectedNote.id) {
        // Update existing note
        await updateNote(selectedNote.id, noteData);
      } else {
        // Add new note
        await addNote(noteData);
      }
      setSelectedNote(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelNoteCreation = () => {
    setSelectedNote(null);
  };

  const deleteNoteHandler = async (id) => {
    try {
      await deleteNote(id);
      closeContextMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const duplicateNoteHandler = async (id) => {
    try {
      const originalNote = notes.find(note => note.id === id);
      if (originalNote) {
        const user = auth.currentUser;
        if (!user) {
          setError('Please sign in to duplicate notes');
          return;
        }

        const duplicateData = {
          ...originalNote,
          userId: user.uid,
          title: `${originalNote.title} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        delete duplicateData.id;
        await addNote(duplicateData);
      }
      closeContextMenu();
    } catch (err) {
      setError(err.message);
    }
  };

  const archiveNoteHandler = async (id, archiveStatus) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (noteToUpdate) {
        await updateNote(id, { ...noteToUpdate, isArchived: archiveStatus });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const pinNoteHandler = async (id, pinStatus) => {
    try {
      const noteToUpdate = notes.find(note => note.id === id);
      if (noteToUpdate) {
        await updateNote(id, { ...noteToUpdate, pinned: pinStatus });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'bg-gray-300';
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesCategory = selectedCategory === 'All Notes' && !note.isArchived ||
                              selectedCategory === 'Archived' && note.isArchived ||
                              selectedCategory !== 'Archived' && note.category === selectedCategory && !note.isArchived;
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || (note.tags && note.tags.includes(selectedTag));
      return matchesCategory && matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;  // Keep the existing order if both are pinned or both are not pinned
    });

  const handleAddTag = async (noteId, newTag) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (noteToUpdate) {
        const updatedTags = [...(noteToUpdate.tags || [])];
        if (!updatedTags.includes(newTag)) {
          updatedTags.push(newTag);
          await updateNote(noteId, { ...noteToUpdate, tags: updatedTags });
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="content-area bg-transparent p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        
        {loading || userLoading ? (
          <div className="flex justify-center items-center w-full h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : !user ? (
          <div className="text-center py-8">
            <p className="text-lg">Please sign in to view and manage your notes.</p>
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <Droppable droppableId={`droppable-${index}`} key={note.id}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="note-wrapper">
                  <Draggable draggableId={note.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onContextMenu={(e) => handleRightClick(e, note.id)}
                        onClick={(e) => {
                          if (contextMenu.visible && contextMenu.noteId === note.id) {
                            e.stopPropagation();
                          } else {
                            setSelectedNote(note);
                          }
                        }}
                        className="note-wrapper"
                      >
                        <Note
                          title={note.title}
                          color={getCategoryColor(note.category)}
                          content={note.content}
                          tags={note.tags}
                          isArchived={note.isArchived}
                          isPinned={note.pinned}
                          onDelete={() => deleteNoteHandler(note.id)}
                          onArchive={() => archiveNoteHandler(note.id, !note.isArchived)}
                          onPin={() => pinNoteHandler(note.id, !note.pinned)}
                          onDuplicate={() => duplicateNoteHandler(note.id)}
                          onTagAdd={(tag) => handleAddTag(note.id, tag)}
                        />
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))
        )}
      </div>
      {selectedNote && (
        <NoteModal
          isOpen={!!selectedNote}
          onRequestClose={cancelNoteCreation}
          title={selectedNote.title}
          content={selectedNote.content}
          onSave={saveNoteContent}
          categories={categories}
          selectedCategory={selectedNote.category}
          tags={selectedNote.tags || []}
        />
      )}

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <ul
          ref={contextMenuRef} // Attach the ref to the context menu
          className="custom-context-menu bg-white shadow-lg rounded-md p-2 absolute"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={() => deleteNoteHandler(contextMenu.noteId)}
          >
            Delete Note
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={() => duplicateNoteHandler(contextMenu.noteId)}
          >
            Duplicate Note
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={closeContextMenu}
          >
            Cancel
          </li>
        </ul>
      )}
    </DragDropContext>
  );
};

export default ContentArea;