// src/components/PrivacyPolicyModal.js

import React from 'react';
import Modal from 'react-modal';

const PrivacyPolicyModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Privacy Policy"
      className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
      <p>This Privacy Policy explains how EzNoteManagerPro collects, uses, and protects your personal information.</p>
      
      <h3 className="text-lg font-semibold mt-4">Information We Collect</h3>
      <p>We collect the following information when you use EzNoteManagerPro:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Personal information (name, email) through Google Sign-In</li>
        <li>Note content and metadata</li>
        <li>File attachments and images you upload</li>
        <li>Usage data and preferences</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">How We Use Your Information</h3>
      <p>Your information is used to:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Provide and maintain EzNoteManagerPro services</li>
        <li>Sync your notes across devices</li>
        <li>Process file exports and imports</li>
        <li>Improve our services and user experience</li>
        <li>Communicate important updates</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Data Storage and Security</h3>
      <p>We use Firebase for secure data storage and authentication. Your notes and files are:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Encrypted during transmission</li>
        <li>Stored securely in the cloud</li>
        <li>Backed up regularly</li>
        <li>Accessible only to you through your account</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Your Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Access your personal data</li>
        <li>Export your notes in PDF or Markdown format</li>
        <li>Delete your account and associated data</li>
        <li>Request information about your data usage</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Updates to Privacy Policy</h3>
      <p>We may update this Privacy Policy as we add new features to EzNoteManagerPro. We will notify you of significant changes through the application.</p>

      <h3 className="text-lg font-semibold mt-4">Contact Us</h3>
      <p>If you have questions about this Privacy Policy, you can reach us through:</p>
      <ul className="list-disc ml-6 mt-2 mb-4">
        <li>Email: <a href="mailto:contact@eznotemanagerpro.com" className="text-blue-500 hover:text-blue-600">contact@eznotemanagerpro.com</a></li>
        <li>Information requests: <a href="mailto:info@eznotemanagerpro.com" className="text-blue-500 hover:text-blue-600">info@eznotemanagerpro.com</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/patrik-karlsson-808b5855/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">Patrik Karlsson</a></li>
      </ul>

      <button 
        onClick={onRequestClose}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Close
      </button>
    </Modal>
  );
};

export default PrivacyPolicyModal;
