import React, { useState } from 'react';
import Note from './Note';
import CreateNote from './CreateNote';
import NoteModal from './NoteModal';
import './ContentArea.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ContentArea = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

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
      title: `Note ${notes.length + 1}`,
      content: '',
      color: '#ADD8E6',
    };
    setSelectedNote(newNote);  // Open modal without adding to state yet
  };

  const saveNoteContent = (newTitle, newContent) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === selectedNote.id 
        ? { ...note, title: newTitle, content: newContent } 
        : note
      )
    );
    
    // If note is new, add it
    if (!notes.some(note => note.id === selectedNote.id)) {
      setNotes(prevNotes => [
        ...prevNotes,
        { ...selectedNote, title: newTitle, content: newContent }
      ]);
    }

    setSelectedNote(null);  // Close the modal after saving
  };

  const cancelNoteCreation = () => {
    setSelectedNote(null);  // Close modal without adding the note
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));  // Remove the note with the given id
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="content-area">
        <CreateNote onCreate={createNote} />
        {notes.map((note, index) => (
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
                        color={note.color}
                        content={note.content}
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
        />
      )}
    </DragDropContext>
  );
};

export default ContentArea;
