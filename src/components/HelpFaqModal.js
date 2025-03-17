// HelpFaqModal.js
import React from 'react';
import Modal from 'react-modal';
import { useTheme } from '../context/ThemeContext';

const HelpFaqModal = ({ isOpen, onRequestClose }) => {
  const { theme } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Help / FAQ"
      className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg w-3/4 h-auto max-w-4xl mx-auto my-16`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className={`text-2xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Help / FAQ</h2>
      <div className={`faq-content ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} overflow-y-auto`} style={{ maxHeight: '60vh' }}>
        <h3 className="text-xl font-bold mb-2">General Questions</h3>
        <p><strong>What is EzNoteManagerPro?</strong></p>
        <p>EzNoteManagerPro is a professional note-taking application that helps you organize, manage, and customize your notes with advanced features. Whether you're brainstorming ideas, planning your day, or storing important information, EzNoteManagerPro provides a user-friendly interface and robust features to support your professional needs.</p>
        
        <h3 className="text-xl font-bold mb-2 mt-4">Key Features</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Advanced rich text editor with Markdown support</li>
          <li>End-to-end encryption for secure note storage</li>
          <li>Offline support for working without internet</li>
          <li>Code blocks with syntax highlighting</li>
          <li>Task lists and checkboxes</li>
          <li>Image uploads with optimization</li>
          <li>File attachments</li>
          <li>Dark/Light theme support</li>
          <li>Real-time content updates</li>
          <li>Google Analytics integration</li>
          <li>PDF and Markdown export options</li>
          <li>Note import functionality</li>
          <li>Category and tag organization</li>
          <li>Advanced search capabilities</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Security and Privacy</h3>
        <p><strong>How does note encryption work?</strong></p>
        <p>EzNoteManagerPro offers end-to-end encryption for your notes:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Enable encryption from the menu in the header</li>
          <li>Notes are encrypted before being saved to the cloud</li>
          <li>Encryption keys are stored securely in your browser</li>
          <li>Encrypted notes show a lock icon in the preview</li>
          <li>Only you can decrypt and read your encrypted notes</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Offline Usage</h3>
        <p><strong>Can I use the app offline?</strong></p>
        <p>Yes! EzNoteManagerPro supports offline functionality:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Notes are cached locally for offline access</li>
          <li>Continue working without internet connection</li>
          <li>Changes sync automatically when back online</li>
          <li>Attachments and images are also available offline</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Working with Notes</h3>
        <p><strong>How do I create a new note?</strong></p>
        <p>To create a new note:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Click the "Create Note" button in the header</li>
          <li>Enter a title for your note</li>
          <li>Select a category (optional)</li>
          <li>Add tags to organize your note (optional)</li>
          <li>Write your note content using the rich text editor</li>
          <li>Click "Save" to store your note</li>
        </ul>

        <p><strong>How do I format my notes?</strong></p>
        <p>The advanced text editor provides several formatting options:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Markdown-style formatting (bold, italic, headers)</li>
          <li>Code blocks with syntax highlighting</li>
          <li>Task lists with checkboxes</li>
          <li>Bulleted and numbered lists</li>
          <li>Links and text highlights</li>
          <li>Image uploads with automatic optimization</li>
          <li>File attachments with preview</li>
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

        <h3 className="text-xl font-bold mb-2 mt-4">Analytics and Performance</h3>
        <p><strong>How is my usage tracked?</strong></p>
        <p>EzNoteManagerPro uses Google Analytics to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Improve user experience based on usage patterns</li>
          <li>Monitor application performance</li>
          <li>Track feature usage to guide development</li>
          <li>Ensure optimal service delivery</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Data Management</h3>
        <p><strong>Is my data secure?</strong></p>
        <p>EzNoteManagerPro uses Firebase for secure cloud storage and offers end-to-end encryption for additional security. Your notes are automatically synchronized across devices when you're signed in, and you can work offline with automatic syncing when you're back online.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Getting Support</h3>
        <p>If you encounter issues or have questions not covered here, you can:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Email us at <a href="mailto:contact@eznotemanagerpro.com" className="text-blue-500 hover:text-blue-600">contact@eznotemanagerpro.com</a> for general inquiries</li>
          <li>Send information requests to <a href="mailto:info@eznotemanagerpro.com" className="text-blue-500 hover:text-blue-600">info@eznotemanagerpro.com</a></li>
          <li>Connect with me on <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">LinkedIn</a></li>
        </ul>
      </div>
      <button
        onClick={onRequestClose}
        className={`mt-4 px-4 py-2 rounded ${
          theme === 'light'
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-blue-500 hover:bg-blue-400 text-white'
        }`}
      >
        Close
      </button>
    </Modal>
  );
};

export default HelpFaqModal;
