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
      id: `note-${notes.length + 1}`,
      title: `Note ${notes.length + 1}`,
      content: '',
      color: '#ADD8E6' // Example color for new notes
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote); // Open the modal to edit the new note
  };

  const saveNoteContent = (id, newContent) => {
    setNotes(notes.map(note => note.id === id ? { ...note, content: newContent } : note));
    setSelectedNote(null); // Close the modal after saving
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="content-area">
        <CreateNote onCreate={createNote} />
        <Droppable droppableId="notes">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexWrap: 'wrap' }}>
              {notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => setSelectedNote(note)}
                      style={{ margin: '10px' }}
                    >
                      <Note
                        title={note.title}
                        color={note.color}
                        content={note.content}
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
          onRequestClose={() => setSelectedNote(null)}
          content={selectedNote.content}
          onSave={(newContent) => saveNoteContent(selectedNote.id, newContent)}
        />
      )}
    </DragDropContext>
  );
};

export default ContentArea;
