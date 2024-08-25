import React, { useState, useEffect, useRef } from 'react';
import Note from './Note';
import NoteModal from './NoteModal';
import './ContentArea.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ContentArea = ({ createNoteTrigger, setCreateNoteTrigger, selectedCategory, searchQuery, categories, notes, setNotes, selectedTag }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, noteId: null });
  const contextMenuRef = useRef(null);

  // Placeholder notes for first-time visitors
  const placeholderNotes = [
    {
      id: `note-1`,
      title: 'Welcome to EzNoteManager!',
      content: 'This is a placeholder note. You can edit, delete, or create your own notes.',
      category: 'Personal',
      tags: [],
      isArchived: false,
      pinned: false,
    },
    {
      id: `note-2`,
      title: 'Getting Started',
      content: 'Use the right-click menu to create, delete, or duplicate notes. You can also organize them by categories and tags.',
      category: 'Ideas',
      tags: [],
      isArchived: false,
      pinned: false,
    },
  ];

  // Check if there are no existing notes and load placeholder notes on first render
  useEffect(() => {
    if (notes.length === 0) {
      setNotes(placeholderNotes);
    }
  }, []); 

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

  const createNote = () => {
    closeContextMenu(); // Hide the context menu when creating a note
    const newNote = {
      id: `note-${Date.now()}`,
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

  const saveNoteContent = (newTitle, newContent, newCategory, newTags) => {
    const updatedNote = { 
      ...selectedNote, 
      title: newTitle || new Date().toLocaleDateString(),
      content: newContent,
      category: newCategory,
      tags: newTags
    };
  
    if (notes.some(note => note.id === selectedNote.id)) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id ? updatedNote : note
      );
      setNotes(updatedNotes);
    } else {
      // Add new note
      setNotes([...notes, updatedNote]);
    }
    setSelectedNote(null);
  };

  const cancelNoteCreation = () => {
    setSelectedNote(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    closeContextMenu();
  };

  const duplicateNote = (id) => {
    const originalNote = notes.find(note => note.id === id);
    if (originalNote) {
      const newNote = { ...originalNote, id: `note-${Date.now()}`, title: `${originalNote.title} (Copy)` };
      setNotes([...notes, newNote]);
    }
    closeContextMenu();
  };

  const archiveNote = (id, archiveStatus) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isArchived: archiveStatus } : note
    );
    setNotes(updatedNotes);
  };

  const pinNote = (id, pinStatus) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, pinned: pinStatus } : note
    );
    setNotes(updatedNotes);
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="content-area bg-transparent p-6 rounded-lg shadow-lg">
        {filteredNotes.map((note, index) => (
          <Droppable droppableId={`droppable-${index}`} key={note.id}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full"
              >
                <Draggable draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onContextMenu={(e) => handleRightClick(e, note.id)} // Handle right-click
                      onClick={(e) => {
                        // Prevent opening the note editor if the context menu was opened
                        if (contextMenu.visible && contextMenu.noteId === note.id) {
                          e.stopPropagation();
                        } else {
                          setSelectedNote(note);
                        }
                      }}
                      className="w-full"
                    >
                      <Note
                        title={note.title}
                        color={getCategoryColor(note.category)}
                        content={note.content}
                        tags={note.tags}
                        isArchived={note.isArchived}
                        isPinned={note.pinned}
                        onDelete={() => deleteNote(note.id)}
                        onArchive={() => archiveNote(note.id, !note.isArchived)}
                        onPin={() => pinNote(note.id, !note.pinned)}
                      />
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
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
            onClick={() => deleteNote(contextMenu.noteId)}
          >
            Delete Note
          </li>
          <li
            className="cursor-pointer hover:bg-gray-200 p-2"
            onClick={() => duplicateNote(contextMenu.noteId)}
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
