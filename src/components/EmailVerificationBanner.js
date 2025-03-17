import React, { useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';

const EmailVerificationBanner = ({ user, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleResendVerification = async () => {
    setIsLoading(true);
    setStatus('');
    
    try {
      await sendEmailVerification(user);
      setStatus('success');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faEnvelope} className="text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Please verify your email address to access all features. Check your inbox for the verification link.</p>
            {status === 'success' && (
              <p className="text-green-600 mt-1">Verification email sent! Please check your inbox.</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 mt-1">Failed to send verification email. Please try again.</p>
            )}
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              ) : null}
              Resend verification email
            </button>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex text-yellow-400 hover:text-yellow-500 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner; 