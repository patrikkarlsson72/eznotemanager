import React from 'react';
import { Menu } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faKey } from '@fortawesome/free-solid-svg-icons';
import { useEncryption } from '../context/EncryptionContext';

const EncryptionSettings = () => {
  const { isEncryptionEnabled, toggleEncryption, hasCloudKey, setShowCloudKeyModal } = useEncryption();

  const handleToggleEncryption = (close) => {
    toggleEncryption();
    close(); // Close the menu after toggling
  };

  const handleOpenModal = (close) => {
    setShowCloudKeyModal(true);
    close(); // Close the menu after opening modal
  };

  return (
    <>
      <Menu.Item>
        {({ active, close }) => (
          <button
            onClick={() => handleToggleEncryption(close)}
            className={`${
              active ? 'bg-gray-100 dark:bg-gray-700' : ''
            } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
          >
            <FontAwesomeIcon icon={faLock} className="mr-3" />
            {isEncryptionEnabled ? 'Disable' : 'Enable'} Encryption
          </button>
        )}
      </Menu.Item>
      {isEncryptionEnabled && (
        <Menu.Item>
          {({ active, close }) => (
            <button
              onClick={() => handleOpenModal(close)}
              className={`${
                active ? 'bg-gray-100 dark:bg-gray-700' : ''
              } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
            >
              <FontAwesomeIcon icon={faKey} className="mr-3" />
              {hasCloudKey ? 'Manage Cloud Key' : 'Setup Cloud Key'}
            </button>
          )}
        </Menu.Item>
      )}
    </>
  );
};

export default EncryptionSettings; 