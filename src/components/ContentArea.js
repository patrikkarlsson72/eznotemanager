import React, { useState, useEffect } from 'react';
import Note from './Note';
import NoteModal from './NoteModal';
import './ContentArea.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ContentArea = ({ createNoteTrigger, setCreateNoteTrigger, selectedCategory, searchQuery, categories }) => {
  // Initialize notes state with function initializer
  const [notes, setNotes] = useState(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem('notes'));
      return storedNotes || [];
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
      return [];
    }
  });
  
  const [selectedNote, setSelectedNote] = useState(null);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

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
    const newNote = {
      id: `note-${Date.now()}`,
      title: '', // Set title to an empty string
      content: '',
      color: '#ADD8E6', // Default color, can be changed as needed
      category: 'Uncategorized' // Default category
    };
    setSelectedNote(newNote);  // Open modal without adding to state yet
  };

  const saveNoteContent = (newTitle, newContent, newCategory, newTags) => {
    const updatedNote = { 
      ...selectedNote, 
      title: newTitle || new Date().toLocaleDateString(), // Use the date if no title is provided
      content: newContent, 
      category: newCategory,
      tags: newTags // Save the tags as part of the note
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
    setSelectedNote(null);  // Close the modal after saving
  };

  const cancelNoteCreation = () => {
    setSelectedNote(null);  // Close modal without adding the note
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));  // Remove the note with the given id
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : 'bg-gray-300'; // Default to gray if no category found
  };

  // Filter notes based on search query and selected category
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'All Notes' || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="content-area bg-transperant p-6 rounded-lg shadow-lg">
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
                      onClick={() => setSelectedNote(note)}
                      className="w-full"
                    >
                      <Note
                        title={note.title}
                        color={getCategoryColor(note.category)}
                        content={note.content}
                        tags={note.tags}  // Ensure tags are passed here
                        onDelete={() => deleteNote(note.id)}
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
          categories={categories} // Pass categories to NoteModal
          selectedCategory={selectedNote.category}
          tags={selectedNote.tags || []}  // Ensure tags are passed and default to an empty array if undefined
        />
      )}
    </DragDropContext>
  );
};

export default ContentArea;
