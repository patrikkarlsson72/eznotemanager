// HelpFaqModal.js
import React from 'react';
import Modal from 'react-modal';

const HelpFaqModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Help / FAQ"
      className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-auto max-w-4xl mx-auto my-16"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4">Help / FAQ</h2>
      <div className="faq-content text-gray-700 overflow-y-auto" style={{ maxHeight: '60vh' }}>
        <h3 className="text-xl font-bold mb-2">General Questions</h3>
        <p><strong>What is EzNoteManagerPro?</strong></p>
        <p>EzNoteManagerPro is a professional note-taking application that helps you organize, manage, and customize your notes with advanced features. Whether you're brainstorming ideas, planning your day, or storing important information, EzNoteManagerPro provides a user-friendly interface and robust features to support your professional needs.</p>
        
        <h3 className="text-xl font-bold mb-2 mt-4">Key Features</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Rich text editor with formatting options</li>
          <li>Code block support with syntax highlighting</li>
          <li>Markdown support</li>
          <li>Image drag & drop</li>
          <li>File attachments</li>
          <li>Checkboxes/todo lists within notes</li>
          <li>Export notes to PDF or Markdown format</li>
          <li>Import notes from Markdown files</li>
          <li>Dark/Light theme support</li>
        </ul>

        <p><strong>How do I create a new note?</strong></p>
        <p>To create a new note, click on the "Create Note" button in the header. This will open the note editor where you can write your note, add tags, select a category, and use various formatting options.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Working with Notes</h3>
        <p><strong>How do I format my notes?</strong></p>
        <p>The rich text editor provides several formatting options:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Basic formatting (bold, italic, underline)</li>
          <li>Code blocks with syntax highlighting</li>
          <li>Markdown syntax support</li>
          <li>Bulleted and numbered lists</li>
          <li>Checkboxes for todo lists</li>
          <li>Image insertion via drag & drop</li>
          <li>File attachments</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Import and Export</h3>
        <p><strong>How do I export my notes?</strong></p>
        <p>To export notes:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Click the menu (three dots) in the header</li>
          <li>Select "Export Notes"</li>
          <li>Choose between PDF or Markdown format</li>
          <li>Select which notes to export (all or selected)</li>
          <li>Preview the export format</li>
          <li>Click Export to download your notes</li>
        </ul>

        <p><strong>How do I import notes?</strong></p>
        <p>To import notes:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Click the menu (three dots) in the header</li>
          <li>Select "Import Notes"</li>
          <li>Drag & drop your Markdown files or click to select</li>
          <li>Preview the imported content</li>
          <li>Click Import to add the notes to your collection</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Theme Settings</h3>
        <p><strong>How do I change the theme?</strong></p>
        <p>Click the sun/moon icon in the header to toggle between light and dark themes. Your preference will be saved automatically.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Search and Filter</h3>
        <p><strong>How do I find specific notes?</strong></p>
        <p>You can find notes using several methods:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Use the search bar to search by title, content, tags, or category</li>
          <li>Filter by category from the sidebar</li>
          <li>Filter by one or multiple tags</li>
          <li>Use the "Clear Filters" button to reset all filters</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Data Management</h3>
        <p><strong>Is my data secure?</strong></p>
        <p>EzNoteManagerPro uses Firebase to securely store your notes in the cloud. Your notes are automatically synchronized across devices when you're signed in to your account.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Getting Support</h3>
        <p>If you encounter issues or have questions not covered here, please reach out to me at <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-yellow-400">LinkedIn</a>. I'm here to help!</p>
      </div>
      <button
        onClick={onRequestClose}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Close
      </button>
    </Modal>
  );
};

export default HelpFaqModal;
