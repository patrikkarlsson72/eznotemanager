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
      <p>This Privacy Policy explains how we collect, use, and protect your personal information.</p>
      
      <h3 className="text-lg font-semibold mt-4">Information We Collect</h3>
      <p>We may collect personal information such as your name, email address, and usage data when you use our services.</p>
      
      <h3 className="text-lg font-semibold mt-4">How We Use Your Information</h3>
      <p>Your information is used to provide and improve our services, communicate with you, and for legal reasons.</p>
      
      <h3 className="text-lg font-semibold mt-4">Cookies and Tracking</h3>
      <p>We use cookies and similar tracking technologies to track the activity on our service and hold certain information.</p>
      
      <h3 className="text-lg font-semibold mt-4">Data Security</h3>
      <p>We take data security seriously and implement appropriate measures to protect your personal information.</p>
      
      <h3 className="text-lg font-semibold mt-4">Your Rights</h3>
      <p>You have the right to access, update, or delete the information we hold about you.</p>
      
      <h3 className="text-lg font-semibold mt-4">Changes to This Privacy Policy</h3>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

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
