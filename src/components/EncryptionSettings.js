import React from 'react';
import { useEncryption } from '../context/EncryptionContext';
import { useTheme } from '../context/ThemeContext';
import { Menu } from '@headlessui/react';

const EncryptionSettings = () => {
  const { isEncryptionEnabled, toggleEncryption } = useEncryption();
  const { theme } = useTheme();

  return (
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
  );
};

export default EncryptionSettings; 