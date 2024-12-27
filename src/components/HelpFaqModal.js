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
        <p><strong>What is EzNoteManager?</strong></p>
        <p>EzNoteManager is a powerful note-taking application that helps you organize, manage, and customize your notes with ease. Whether you're brainstorming ideas, planning your day, or storing important information, EzNoteManager provides a user-friendly interface and robust features to support your needs.</p>
        
        <p><strong>How do I create a new note?</strong></p>
        <p>To create a new note, click on the "Add Note" button in the header. This will open the note editor where you can write your note, add tags, select a category, and more.</p>

        <p><strong>How do I delete a note?</strong></p>
        <p>To delete a note, right-click on the note and select "Delete Note" from the context menu. You can also click the trash icon directly on the note to delete it instantly.</p>

        <p><strong>How do I duplicate a note?</strong></p>
        <p>To duplicate a note, right-click on the note and select "Duplicate Note" from the context menu. This will create an exact copy of the selected note with all its content, tags, and category.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Working with Notes</h3>
        <p><strong>How do I edit a note?</strong></p>
        <p>To edit a note, simply click on the note you wish to edit. This will open the note editor where you can modify the content, add or remove tags, change the category, and more.</p>

        <p><strong>How do I organize my notes?</strong></p>
        <p>You can organize your notes in several ways:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Drag and drop notes to reorder them</li>
          <li>Pin important notes to keep them at the top</li>
          <li>Categorize notes using custom categories</li>
          <li>Add tags for easy filtering and searching</li>
          <li>Archive notes you don't need right now</li>
        </ul>

        <p><strong>How do I archive a note?</strong></p>
        <p>To archive a note, click the archive icon on the note or right-click and select "Archive" from the context menu. Archived notes can be accessed by clicking "View Archived Notes" in the sidebar.</p>

        <p><strong>How do I pin a note?</strong></p>
        <p>To pin a note, click the pin icon on the note or right-click and select "Pin Note" from the context menu. Pinned notes will always appear at the top of your notes list. Click the pin icon again to unpin.</p>

        <h3 className="text-xl font-bold mb-2 mt-4">Categories and Tags</h3>
        <p><strong>How do I manage categories?</strong></p>
        <p>In the sidebar, you can:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Create new categories by entering a name and selecting a color</li>
          <li>Edit categories by clicking the edit icon next to the category name</li>
          <li>Delete categories by clicking the trash icon (note: this will also delete or move associated notes)</li>
          <li>Click on any category to filter notes by that category</li>
        </ul>

        <p><strong>How do I work with tags?</strong></p>
        <p>Tags are a flexible way to organize your notes:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Add tags when creating or editing a note</li>
          <li>Click on tags in the sidebar to filter notes</li>
          <li>Right-click on a tag in the sidebar to delete it</li>
          <li>Drag tags from the sidebar onto notes to quickly apply them</li>
          <li>Use the "Manage Tags" button to organize all your tags</li>
        </ul>

        <p><strong>How do I delete a tag?</strong></p>
        <p>There are two ways to delete a tag:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Right-click on the tag in the sidebar and select "Delete Tag"</li>
          <li>Use the "Manage Tags" interface to delete multiple tags at once</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Search and Filter</h3>
        <p><strong>How do I find specific notes?</strong></p>
        <p>You can find notes using several methods:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Use the search bar to search by title or content</li>
          <li>Filter by category from the sidebar</li>
          <li>Filter by one or multiple tags</li>
          <li>Combine search and filters for more precise results</li>
        </ul>

        <h3 className="text-xl font-bold mb-2 mt-4">Data Management</h3>
        <p><strong>How is my data stored?</strong></p>
        <p>EzNoteManager uses Firebase to securely store your notes in the cloud. Your notes are automatically synchronized across devices when you're signed in to your account.</p>

        <p><strong>Is my data backed up?</strong></p>
        <p>Yes, your notes are automatically backed up to Firebase's secure cloud storage. You can access your notes from any device by signing in to your account.</p>

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
