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
        {/* Insert the Help/FAQ content here */}
        <h3 className="text-xl font-bold mb-2">General Questions</h3>
        <p><strong>What is EzNoteManager?</strong></p>
        <p>EzNoteManager is a powerful note-taking application that helps you organize, manage, and customize your notes with ease. Whether you're brainstorming ideas, planning your day, or storing important information, EzNoteManager provides a user-friendly interface and robust features to support your needs.</p>
        <p><strong>How do I create a new note?</strong></p>
        <p>To create a new note, click on the "Add Note" button available in the header. This will open the note editor, where you can start writing your note immediately. </p>
        <p><strong>How do I delete a note?</strong></p>

<p>To delete a note, right-click on the note you wish to delete and select "Delete Note" from the context menu. You can also click the trash icon directly on the note to delete it instantly.</p>

<p><strong>How do I duplicate a note?</strong></p>

<p>If you want to duplicate a note, right-click on the note and select "Duplicate Note" from the context menu. This will create a copy of the selected note.</p>

<h3 className="text-xl font-bold mb-2">Working with Notes</h3>

<p><strong>How do I edit a note?</strong></p>

<p>To edit a note, simply click on the note you wish to edit. This will open the note in the editor, where you can modify the content, add images, change the category, and more.</p>

<p><strong>Can I add images to my notes?</strong></p>

<p>Yes, you can add images to your notes using the built-in editor. When you are editing a note, click on the image icon in the toolbar to upload and insert an image into your note.</p>

<p><strong>How do I resize images within a note?</strong></p>

<p>You can resize images directly in the editor by clicking on the image and dragging the corners to your desired size. Images in the note previews are automatically adjusted to fit within the content area while maintaining their aspect ratio.</p>

<p><strong>How do I archive a note?</strong></p>

<p>To archive a note, click the archive icon on the note. Archived notes can be accessed later by selecting the "Archived" category from the sidebar.</p>

<p><strong>How do I pin a note?</strong></p>

<p>Pinning a note will keep it at the top of your list for easy access. To pin a note, click the pin icon on the note. You can unpin it at any time by clicking the pin icon again.</p>

<h3 className="text-xl font-bold mb-2">Categories and Tags</h3>

<p><strong>How do I categorize my notes?</strong></p>

<p>When creating or editing a note, you can select a category from the dropdown menu. Categories help you organize your notes and quickly find them later.</p>

<p><strong>How do I create a new category?</strong></p>

<p>In the sidebar, you can create a new category by entering a name for the category and selecting a color. Then, click the "Create Category" button to add it to your list.</p>

<p><strong>How do I edit a category?</strong></p>

<p>To edit an existing category, click the edit icon next to the category name in the sidebar. You can change the name and color of the category, then save your changes.</p>

<p><strong>How do I delete a category?</strong></p>

<p>To delete a category, click the trash icon next to the category name in the sidebar. Please note that if a category contains notes, you will be asked to confirm whether you want to delete the notes along with the category.</p>

<p><strong>How do I add tags to my notes?</strong></p>

<p>Tags can be added when creating or editing a note. Simply type the tag name and press Enter. Tags are a great way to group related notes together.</p>

<p><strong>How do I manage tags?</strong></p>

<p>You can manage your tags by clicking the "Manage Tags" button in the sidebar. From there, you can add, rename, or delete tags as needed.</p>

<p><strong>How do I filter notes by tags or categories?</strong></p>

<p>You can filter notes by selecting a tag or category in the sidebar. The selected filter will apply to all notes, showing only those that match the chosen tag or category. You can also clear the filters using the "Clear Filters" button in the header.</p>

<p><strong>Can I search for notes?</strong></p>

<p>Yes, you can search for notes using the search bar in the header. You can filter your search by title, content, tags, or category to find the exact note you're looking for.</p>

<h3 className="text-xl font-bold mb-2">Advanced Features</h3>

<p><strong>Can I drag and drop notes?</strong></p>

<p>Yes! You can drag and drop notes to reorder them within the content area. This makes it easy to prioritize your notes as needed.</p>

<p><strong>How is my data stored?</strong></p>

<p>EzNoteManager stores your notes locally on your device. If you clear your browser’s storage, your notes will be deleted. We recommend backing up your important notes regularly.</p>

<p><strong>Is there a way to back up my notes?</strong></p>

<p>Currently, EzNoteManager does not support cloud backups directly. However, you can export your notes manually by copying the content and storing it in a secure location. We are working on introducing more advanced backup options in future updates.</p>

<h3 className="text-xl font-bold mb-2">Troubleshooting</h3>

<p><strong>My images are not appearing in the note previews, what should I do?</strong></p>

<p>Ensure that the images were uploaded correctly when creating or editing your note. If the problem persists, try clearing your browser cache and reloading the page.</p>

<p><strong>My notes disappeared after I refreshed the page. What happened?</strong></p>

<p>EzNoteManager stores notes locally in your browser. If you clear your browser's storage or use a different browser, your notes might be lost. Always back up your important notes manually.</p>

<p><strong>I accidentally deleted a category. Can I recover the notes?</strong></p>

<p>If you delete a category, the notes associated with that category will also be deleted if you confirmed the deletion. Unfortunately, once deleted, the notes cannot be recovered.</p>

<h3 className="text-xl font-bold mb-2">Getting Support</h3>

<p>If you encounter issues or have further questions, please don't hesitate to reach out to me at <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-yellow-400">LinkedIn</a>. I'm here to help!</p>
        {/* Continue with the rest of the FAQ content... */}
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
