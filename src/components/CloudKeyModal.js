import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useEncryption } from '../context/EncryptionContext';
import { useTheme } from '../context/ThemeContext';

const CloudKeyModal = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { saveKeyToCloud, loadKeyFromCloud, hasCloudKey, showCloudKeyModal, setShowCloudKeyModal, changeCloudKeyPassword } = useEncryption();
  const { theme } = useTheme();
  const [mode, setMode] = useState(() => hasCloudKey ? 'load' : 'save');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showCloudKeyModal) {
      setPassword('');
      setConfirmPassword('');
      setOldPassword('');
      setError('');
      setMode(hasCloudKey ? 'load' : 'save');
    }
  }, [showCloudKeyModal, hasCloudKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'save') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        const success = await saveKeyToCloud(password);
        if (success) {
          setShowCloudKeyModal(false);
        } else {
          throw new Error('Failed to save key to cloud');
        }
      } else if (mode === 'change') {
        if (password !== confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('New password must be at least 8 characters long');
        }
        if (oldPassword === password) {
          throw new Error('New password must be different from the old password');
        }
        const success = await changeCloudKeyPassword(oldPassword, password);
        if (success) {
          setShowCloudKeyModal(false);
        } else {
          throw new Error('Failed to change password. Please check your old password.');
        }
      } else {
        const success = await loadKeyFromCloud(password);
        if (success) {
          setShowCloudKeyModal(false);
        } else {
          throw new Error('Failed to load key from cloud. Please check your password.');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={showCloudKeyModal}
      onRequestClose={() => setShowCloudKeyModal(false)}
      contentLabel="Cloud Key Management"
      className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-6 rounded-lg shadow-lg w-[500px] max-w-full mx-auto`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      ariaHideApp={false}
    >
      <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
        {mode === 'save' ? 'Save Encryption Key to Cloud' : 
         mode === 'change' ? 'Change Cloud Key Password' : 
         'Load Encryption Key from Cloud'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'change' && (
          <div>
            <label className={`block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full p-2 border rounded ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-800'
                  : 'bg-gray-700 border-gray-600 text-white'
              }`}
              placeholder="Enter your current password"
              autoFocus
            />
          </div>
        )}

        <div>
          <label className={`block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            {mode === 'change' ? 'New Password' : 'Password'}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 border rounded ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-800'
                : 'bg-gray-700 border-gray-600 text-white'
            }`}
            placeholder={mode === 'change' ? "Enter new password" : "Enter your password"}
            autoFocus={mode !== 'change'}
          />
        </div>

        {(mode === 'save' || mode === 'change') && (
          <div>
            <label className={`block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Confirm {mode === 'change' ? 'New ' : ''}Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 border rounded ${
                theme === 'light'
                  ? 'bg-white border-gray-300 text-gray-800'
                  : 'bg-gray-700 border-gray-600 text-white'
              }`}
              placeholder={mode === 'change' ? "Confirm new password" : "Confirm your password"}
            />
          </div>
        )}

        <div className="flex justify-between">
          {hasCloudKey && (
            <button
              type="button"
              onClick={() => setMode(mode === 'load' ? 'change' : 'load')}
              className={`px-4 py-2 rounded ${
                theme === 'light'
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {mode === 'load' ? 'Change Password' : 'Back to Load'}
            </button>
          )}
          {!hasCloudKey && (
            <button
              type="button"
              onClick={() => setMode(mode === 'save' ? 'load' : 'save')}
              className={`px-4 py-2 rounded ${
                theme === 'light'
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {mode === 'save' ? 'Switch to Load' : 'Switch to Save'}
            </button>
          )}

          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setShowCloudKeyModal(false)}
              className={`px-4 py-2 border rounded ${
                theme === 'light'
                  ? 'border-gray-300 hover:bg-gray-100'
                  : 'border-gray-600 hover:bg-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : 
               mode === 'save' ? 'Save Key' : 
               mode === 'change' ? 'Change Password' : 
               'Load Key'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CloudKeyModal;