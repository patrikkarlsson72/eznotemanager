// src/components/TermsOfServiceModal.js

import React from 'react';
import Modal from 'react-modal';

const TermsOfServiceModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Terms of Service"
      className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
      <p>These Terms of Service govern your use of EzNoteManagerPro and its associated services.</p>
      
      <h3 className="text-lg font-semibold mt-4">Acceptance of Terms</h3>
      <p>By accessing or using EzNoteManagerPro, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
      
      <h3 className="text-lg font-semibold mt-4">Service Description</h3>
      <p>EzNoteManagerPro provides:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Professional note-taking and organization tools</li>
        <li>Cloud storage and synchronization</li>
        <li>File attachment and image upload capabilities</li>
        <li>Export and import functionality</li>
        <li>Customization and formatting options</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">User Responsibilities</h3>
      <p>As a user of EzNoteManagerPro, you agree to:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Provide accurate account information</li>
        <li>Use the service only for lawful purposes</li>
        <li>Not upload malicious content or files</li>
        <li>Respect intellectual property rights</li>
        <li>Not attempt to breach system security</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Account Security</h3>
      <p>You are responsible for:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Maintaining the security of your account</li>
        <li>All activities that occur under your account</li>
        <li>Notifying us of any unauthorized access</li>
        <li>Protecting your authentication credentials</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Data Usage</h3>
      <p>By using EzNoteManagerPro, you understand that:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Your notes are stored securely in the cloud</li>
        <li>You retain ownership of your content</li>
        <li>We may process your data to provide the service</li>
        <li>You can export your data at any time</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Service Modifications</h3>
      <p>We reserve the right to:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Modify or discontinue features</li>
        <li>Update the service and these terms</li>
        <li>Change storage limits or functionality</li>
        <li>Implement new capabilities</li>
      </ul>
      
      <h3 className="text-lg font-semibold mt-4">Limitation of Liability</h3>
      <p>EzNoteManagerPro is provided "as is" without warranties of any kind. We are not liable for any damages that may occur from your use of the service.</p>
      
      <h3 className="text-lg font-semibold mt-4">Contact</h3>
      <p>For questions about these Terms of Service, you can reach us through:</p>
      <ul className="list-disc ml-6 mt-2 mb-4">
        <li>General inquiries: <a href="mailto:contact@eznotemanagerpro.com" className="text-blue-500 hover:text-blue-600">contact@eznotemanagerpro.com</a></li>
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

export default TermsOfServiceModal;
