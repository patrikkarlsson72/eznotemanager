import React, { useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileCode, faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const ExportModal = ({ isOpen, onRequestClose, onExport, notes = [] }) => {
  const { theme } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [previewFormat, setPreviewFormat] = useState('pdf');
  const [selectedNotes, setSelectedNotes] = useState([]);

  const handleExport = (format) => {
    console.log('Exporting notes in format:', format);
    console.log('Selected notes:', selectedNotes);
    const notesToExport = selectedNotes.length > 0 
      ? notes.filter(note => selectedNotes.includes(note.id))
      : notes;
    console.log('Notes to export:', notesToExport);
    onExport(format, notesToExport);
    onRequestClose();
  };

  const handleShowPreview = (format) => {
    console.log('Showing preview for format:', format);
    setPreviewFormat(format);
    setShowPreview(true);
  };

  const handleExportClick = () => {
    console.log('Export button clicked, format:', previewFormat);
    handleExport(previewFormat);
  };

  const toggleNoteSelection = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes.map(note => note.id));
    }
  };

  const renderNoteList = () => {
    return (
      <div className={`border rounded-lg p-4 mb-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Select Notes to Export
          </h3>
          <button
            onClick={handleSelectAll}
            className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} hover:underline`}
          >
            {selectedNotes.length === notes.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              className={`flex items-center p-2 rounded cursor-pointer ${
                theme === 'light'
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-gray-800'
              }`}
              onClick={() => toggleNoteSelection(note.id)}
            >
              <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                selectedNotes.includes(note.id)
                  ? 'bg-blue-500 border-blue-500'
                  : theme === 'light'
                    ? 'border-gray-300'
                    : 'border-gray-600'
              }`}>
                {selectedNotes.includes(note.id) && (
                  <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                  {note.title}
                </h4>
                {note.category && (
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {note.category}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPreview = () => {
    const notesToPreview = selectedNotes.length > 0
      ? notes.filter(note => selectedNotes.includes(note.id)).slice(0, 2)
      : notes.slice(0, 2);

    const totalNotes = selectedNotes.length > 0
      ? selectedNotes.length
      : notes.length;

    if (previewFormat === 'pdf') {
      return (
        <div className={`border rounded-lg p-4 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          {notesToPreview.map((note, index) => (
            <div key={index} className="mb-6">
              <h2 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                {note.title}
              </h2>
              {note.category && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Category: {note.category}
                </p>
              )}
              {note.tags?.length > 0 && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Tags: {note.tags.join(', ')}
                </p>
              )}
              <div 
                className={`mt-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              {index < notesToPreview.length - 1 && <hr className="my-4 border-gray-600" />}
            </div>
          ))}
          {totalNotes > 2 && (
            <p className={`text-sm text-center mt-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              + {totalNotes - 2} more notes
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className={`font-mono text-sm border rounded-lg p-4 ${
          theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'
        }`}>
          <pre className={`whitespace-pre-wrap ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            # My Notes

{notesToPreview.map(note => `## ${note.title}

${note.category ? `Category: ${note.category}\n` : ''}${note.tags?.length ? `Tags: ${note.tags.join(', ')}\n` : ''}
${note.content}

---

`).join('\n')}
            {totalNotes > 2 ? `\n... ${totalNotes - 2} more notes ...` : ''}
          </pre>
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Export Notes"
      className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg ${showPreview ? 'w-[800px]' : 'w-96'} max-w-full mx-auto`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="flex justify-between items-start">
        <div className={`${showPreview ? 'w-1/2 pr-4' : 'w-full'}`}>
          <h2 className={`text-2xl font-semibold mb-6 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Export Notes
          </h2>

          {renderNoteList()}

          <div className="space-y-4">
            <button
              onClick={() => handleShowPreview('pdf')}
              className={`w-full p-4 rounded-lg border ${
                theme === 'light'
                  ? 'border-gray-200 hover:bg-gray-50'
                  : 'border-gray-700 hover:bg-gray-700'
              } flex items-center space-x-4 transition-colors`}
            >
              <FontAwesomeIcon 
                icon={faFilePdf} 
                className="text-red-500 text-2xl" 
              />
              <div className="text-left flex-1">
                <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Export as PDF
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Create a formatted PDF document of your notes
                </p>
              </div>
              <FontAwesomeIcon 
                icon={faEye} 
                className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-500`}
              />
            </button>

            <button
              onClick={() => handleShowPreview('markdown')}
              className={`w-full p-4 rounded-lg border ${
                theme === 'light'
                  ? 'border-gray-200 hover:bg-gray-50'
                  : 'border-gray-700 hover:bg-gray-700'
              } flex items-center space-x-4 transition-colors`}
            >
              <FontAwesomeIcon 
                icon={faFileCode} 
                className="text-blue-500 text-2xl" 
              />
              <div className="text-left flex-1">
                <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                  Export as Markdown
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Export your notes in Markdown format
                </p>
              </div>
              <FontAwesomeIcon 
                icon={faEye} 
                className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} hover:text-blue-500`}
              />
            </button>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onRequestClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              Cancel
            </button>
            {showPreview && (
              <button
                onClick={handleExportClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export {selectedNotes.length > 0 ? `(${selectedNotes.length} notes)` : ''}
              </button>
            )}
          </div>
        </div>

        {showPreview && (
          <div className="w-1/2 pl-4 border-l">
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Preview
            </h3>
            {renderPreview()}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExportModal; 