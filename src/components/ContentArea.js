import React, { useState, useEffect, useRef } from 'react';
import Note from './Note';
import NoteModal from './NoteModal';
import './ContentArea.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { addNote, updateNote, deleteNote, subscribeToNotes, getNotes, updateNoteOrder } from '../firebase/notes';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const ITEMS_PER_ROW = 4; // Or calculate based on screen width

const ContentArea = ({ 
  createNoteTrigger, 
  setCreateNoteTrigger, 
  selectedCategory, 
  searchQuery, 
  categories, 
  notes, 
  setNotes, 
  selectedTag, 
  tags,
  selectedNote,
  setSelectedNote
}) => {
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

  // Split notes into rows
  const getNotesInRows = (notes) => {
    const rows = [];
    for (let i = 0; i < notes.length; i += ITEMS_PER_ROW) {
      rows.push(notes.slice(i, i + ITEMS_PER_ROW));
    }
    return rows;
  };

  const getActualRowIndex = (rowIndex, index, notesArray) => {
    let actualIndex = 0;
    for (let i = 0; i < rowIndex; i++) {
      actualIndex += Math.min(ITEMS_PER_ROW, notesArray.length - (i * ITEMS_PER_ROW));
    }
    return actualIndex + index;
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    
    if (!destination) return;

    try {
      const allNotes = Array.from(notes);
      const filteredNotesArray = Array.from(filteredNotes);
      
      // Find the actual note being moved
      const sourceRowIndex = parseInt(source.droppableId.split('-')[1]);
      const destRowIndex = parseInt(destination.droppableId.split('-')[1]);
      
      console.log('Drag operation:', {
        sourceRow: sourceRowIndex,
        destRow: destRowIndex,
        sourceIndex: source.index,
        destIndex: destination.index
      });

      // Get the actual indices
      const sourceIndex = sourceRowIndex * ITEMS_PER_ROW + source.index;
      const destIndex = destRowIndex * ITEMS_PER_ROW + destination.index;
      
      // Get the actual note being moved
      const sourceNote = filteredNotesArray[sourceIndex];
      
      // Sort notes by order for accurate positioning
      const sortedNotes = [...filteredNotesArray].sort((a, b) => a.order - b.order);
      
      // Find the notes before and after the destination position
      let prevNote = null;
      let nextNote = null;
      let newOrder;
      
      if (destIndex === 0) {
        nextNote = sortedNotes[0];
        newOrder = nextNote.order - 1000;
      } else if (destIndex >= filteredNotesArray.length) {
        prevNote = sortedNotes[sortedNotes.length - 1];
        newOrder = prevNote.order + 1000;
      } else {
        // Find the actual notes that will be before and after the moved note
        const notesWithoutSource = sortedNotes.filter(note => note.id !== sourceNote.id);
        prevNote = notesWithoutSource[destIndex - 1];
        nextNote = notesWithoutSource[destIndex];
        
        if (prevNote && nextNote) {
          newOrder = (prevNote.order + nextNote.order) / 2;
        } else if (prevNote) {
          newOrder = prevNote.order + 1000;
        } else if (nextNote) {
          newOrder = nextNote.order - 1000;
        }
      }

      console.log('Order calculation:', {
        oldOrder: sourceNote?.order,
        newOrder: newOrder,
        prevNoteOrder: prevNote?.order,
        nextNoteOrder: nextNote?.order
      });

      // Update the note order in Firebase
      await updateNoteOrder(sourceNote.id, newOrder);
      
      // Update local state
      const updatedNotes = allNotes.map(note => 
        note.id === sourceNote.id ? { ...note, order: newOrder } : note
      );
      
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error reordering notes:', error);
      setError('Failed to reorder notes. Please try again.');
    }
  };

  const calculateNewOrder = (index, notes) => {
    try {
      // Handle edge cases
      if (!notes || notes.length === 0) return 1000;
      if (index === 0) return Math.max(0, (notes[0]?.order ?? 1000) - 1000);
      if (index === notes.length - 1) return (notes[notes.length - 1]?.order ?? 0) + 1000;

      const prevNote = notes[index - 1];
      const nextNote = notes[index + 1];

      // If either note is missing, provide fallback values
      if (!prevNote || !nextNote) return index * 1000;

      // Calculate the midpoint between the previous and next notes
      const prevOrder = prevNote.order ?? (index - 1) * 1000;
      const nextOrder = nextNote.order ?? (index + 1) * 1000;

      return Math.floor(prevOrder + (nextOrder - prevOrder) / 2);
    } catch (error) {
      console.error('Error calculating order:', error);
      // Fallback to a safe value based on index
      return index * 1000;
    }
  };

  const createNote = async () => {
    closeContextMenu();
    const user = auth.currentUser;
    if (!user) {
      setError('Please sign in to create notes');
      return;
    }

    // Find the highest order value
    const maxOrder = notes.reduce((max, note) => Math.max(max, note.order || 0), 0);

    const newNote = {
      userId: user.uid,
      title: '',
      content: '',
      color: '#ADD8E6',
      category: 'Uncategorized',
      tags: [],
      isArchived: false,
      pinned: false,
      order: maxOrder + 1000 // Place new note at the end
    };
    setSelectedNote(newNote);
  };

  const saveNoteContent = async (newTitle, newContent, newCategory, newTags) => {
    try {
      console.log('Saving note content:', { newTitle, newContent, newCategory, newTags });
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
        pinned: selectedNote.pinned || false,
        order: selectedNote.order || (notes.length > 0 ? Math.max(...notes.map(n => n.order || 0)) + 1000 : 1000)
      };

      console.log('Note data to save:', noteData);

      if (selectedNote.id) {
        // Update existing note
        await updateNote(selectedNote.id, noteData);
      } else {
        // Add new note
        await addNote(noteData);
      }
      setSelectedNote(null);
    } catch (err) {
      console.error('Error saving note:', err);
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

  // Filter notes
  const filteredNotes = notes
    .filter(note => {
      // Debug selected category first
      console.log('Current selected category:', selectedCategory);
      console.log('All notes:', notes.length);
      
      // More explicit category matching logic
      let matchesCategory = false;
      
      if (selectedCategory === 'All Notes') {
        matchesCategory = !note.isArchived;
        console.log(`Note ${note.title}: checking All Notes condition:`, { isArchived: note.isArchived, matchesCategory });
      } else if (selectedCategory === 'Archived') {
        matchesCategory = note.isArchived;
        console.log(`Note ${note.title}: checking Archived condition:`, { isArchived: note.isArchived, matchesCategory });
      } else {
        matchesCategory = note.category === selectedCategory && !note.isArchived;
        console.log(`Note ${note.title}: checking specific category condition:`, { 
          noteCategory: note.category, 
          selectedCategory, 
          isArchived: note.isArchived, 
          matchesCategory 
        });
      }

      const matchesSearch = !searchQuery || 
                          note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = !selectedTag?.length || 
                         (note.tags && selectedTag.every(tag => note.tags.includes(tag)));

      return matchesCategory && matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (a.order || 0) - (b.order || 0);
    });

  // Log filtered results
  React.useEffect(() => {
    console.log("Final filtered notes:", filteredNotes.length);
    filteredNotes.forEach(note => {
      console.log("- Note:", {
        id: note.id,
        title: note.title,
        category: note.category || 'No category',
        isArchived: !!note.isArchived,
        order: note.order
      });
    });
  }, [filteredNotes]);

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
          <div className="notes-container">
            {getNotesInRows(filteredNotes).map((rowNotes, rowIndex) => (
              <Droppable
                key={`row-${rowIndex}`}
                droppableId={`row-${rowIndex}`}
                direction="horizontal"
                type="NOTE"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`notes-row ${snapshot.isDraggingOver ? 'drop-target' : ''}`}
                    data-row-index={rowIndex}
                  >
                    {rowNotes.map((note, index) => (
                      <Draggable
                        key={note.id}
                        draggableId={note.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
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
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.5 : 1,
                              transform: snapshot.isDragging 
                                ? `${provided.draggableProps.style.transform} rotate(2deg)`
                                : provided.draggableProps.style.transform
                            }}
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
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        )}
      </div>
      {selectedNote && (
        <NoteModal
          isOpen={!!selectedNote}
          onRequestClose={() => setSelectedNote(null)}
          title={selectedNote.title}
          content={selectedNote.content}
          onSave={saveNoteContent}
          categories={categories}
          selectedCategory={selectedNote.category}
          tags={selectedNote.tags || []}
          availableTags={tags}
        />
      )}

      {contextMenu.visible && (
        <ul
          ref={contextMenuRef}
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