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
      <p>These Terms of Service govern your use of our website and services.</p>
      
      <h3 className="text-lg font-semibold mt-4">Acceptance of Terms</h3>
      <p>By accessing or using our service, you agree to be bound by these Terms.</p>
      
      <h3 className="text-lg font-semibold mt-4">User Responsibilities</h3>
      <p>You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.</p>
      
      <h3 className="text-lg font-semibold mt-4">Account Security</h3>
      <p>You are responsible for maintaining the confidentiality of your account and password.</p>
      
      <h3 className="text-lg font-semibold mt-4">Limitation of Liability</h3>
      <p>We are not liable for any damages that may occur from your use of the service.</p>
      
      <h3 className="text-lg font-semibold mt-4">Governing Law</h3>
      <p>These Terms will be governed by the laws of the jurisdiction in which we operate.</p>

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
