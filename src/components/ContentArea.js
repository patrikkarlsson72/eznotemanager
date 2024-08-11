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
    const newNote = { ...selectedNote, title: newTitle, content: newContent };
    setNotes([...notes, newNote]);
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
        <Droppable droppableId="notes">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                overflowY: 'auto',
                maxHeight: '100%',
              }}
            >
              {notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        margin: '10px',
                        cursor: 'grab',
                        height: '150px',
                      }}
                      onClick={() => setSelectedNote(note)}
                    >
                      <Note
                        title={note.title}
                        color={note.color}
                        content={note.content}
                        onDelete={() => deleteNote(note.id)}  // Pass the delete function
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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
