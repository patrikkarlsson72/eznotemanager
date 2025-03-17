import React from 'react';
import { useEncryption } from '../context/EncryptionContext';
import { useTheme } from '../context/ThemeContext';
import { Menu } from '@headlessui/react';

const EncryptionSettings = ({ showCloudKeyModal, setShowCloudKeyModal }) => {
  const { isEncryptionEnabled, toggleEncryption, hasCloudKey } = useEncryption();
  const { theme } = useTheme();

  console.log('EncryptionSettings render:', { isEncryptionEnabled, hasCloudKey, showCloudKeyModal });

  const handleOpenModal = () => {
    console.log('Opening cloud key modal');
    setShowCloudKeyModal(true);
    // Close the menu when opening the modal
    const menuButton = document.querySelector('[aria-controls]');
    if (menuButton) menuButton.click();
  };

  return (
    <div>
      <Menu.Item>
        {({ active }) => (
          <button
            onClick={toggleEncryption}
            className={`
              ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
              group flex items-center w-full px-4 py-2 text-sm
              ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
            `}
          >
            <span className={`mr-3 ${isEncryptionEnabled ? 'text-green-500' : 'text-gray-400'}`}>
              🔒
            </span>
            {isEncryptionEnabled ? 'Disable' : 'Enable'} Encryption
          </button>
        )}
      </Menu.Item>

      {isEncryptionEnabled && (
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleOpenModal}
              className={`
                ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                group flex items-center w-full px-4 py-2 text-sm
                ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
              `}
            >
              <span className={`mr-3 ${hasCloudKey ? 'text-blue-500' : 'text-gray-400'}`}>
                ☁️
              </span>
              {hasCloudKey ? 'Manage Cloud Key' : 'Setup Cloud Key'}
            </button>
          )}
        </Menu.Item>
      )}
    </div>
  );
};

export default EncryptionSettings; 