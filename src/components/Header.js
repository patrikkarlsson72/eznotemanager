import React, { useState } from 'react';
import logo from '../assets/EzNoteManagerPrologo.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import GoogleSignIn from './GoogleSignIn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSun, faMoon, faFileExport, faFileImport, faEllipsisV, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import KeyboardShortcutGuide from './KeyboardShortcutGuide';
import ExportModal from './ExportModal';
import { useTheme } from '../context/ThemeContext';
import { Menu } from '@headlessui/react';
import EncryptionSettings from './EncryptionSettings';

const Header = ({
  onSearchChange,
  searchQuery = '',
  searchFilter = 'title',
  setSearchFilter,
  onClearFilters,
  triggerNewNote,
  setSelectedTag,
  setSelectedCategory,
  searchInputRef,
  onExport,
  onImport,
  notes = [],
  showCloudKeyModal,
  setShowCloudKeyModal
}) => {
  const [user] = useAuthState(auth);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleClearFilters = () => {
    onClearFilters();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <header className={`bg-transparent p-4 flex items-center justify-between w-full ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-4" />
        <h1 className="font-sans text-2xl font-bold">
          EzNote<span className="text-yellow-500">Manager</span><span className="text-blue-500">Pro</span>
        </h1>
      </div>
      
      <div className="flex flex-col items-center flex-1">
        <div className="flex w-full max-w-lg">
          <button
            onClick={handleClearFilters}
            className="p-1 text-sm rounded bg-red-600 text-white hover:bg-red-500 mr-2"
          >
            Clear Filters
          </button>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Search notes by ${searchFilter.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`p-1 text-sm border rounded w-full ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                : 'bg-gray-700 border-gray-300 text-white placeholder-gray-400'
            }`}
          />
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className={`ml-2 p-1 text-sm border rounded ${
              theme === 'light'
                ? 'bg-white border-gray-300 text-gray-800'
                : 'bg-gray-700 border-gray-300 text-white'
            }`}
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
            <option value="tags">Tags</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
            <span className="mr-4">Welcome, {user.displayName}</span>
            <button
              onClick={toggleTheme}
              className={`ml-4 w-8 h-8 rounded-full flex items-center justify-center focus:outline-none ${
                theme === 'light'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-yellow-500 hover:bg-yellow-600'
              } text-white`}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <button
              onClick={triggerNewNote}
              className="create-note-button bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 ml-4 rounded-full shadow-lg text-xl"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Note
            </button>
            <button
              onClick={() => setShowShortcutGuide(true)}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              title="Keyboard Shortcuts"
            >
              ?
            </button>
            <Menu as="div" className="relative ml-4">
              <Menu.Button className={`p-2 hover:bg-opacity-80 rounded-lg transition-colors ${
                theme === 'light' 
                  ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                  : 'text-gray-200 hover:text-white hover:bg-gray-700'
              }`}>
                <FontAwesomeIcon icon={faEllipsisV} className="text-xl" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleExport}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                    >
                      <FontAwesomeIcon icon={faFileExport} className="mr-3" />
                      Export Notes
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onImport()}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                    >
                      <FontAwesomeIcon icon={faFileImport} className="mr-3" />
                      Import Notes
                    </button>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                <EncryptionSettings 
                  showCloudKeyModal={showCloudKeyModal}
                  setShowCloudKeyModal={setShowCloudKeyModal}
                />
              </Menu.Items>
            </Menu>
          </>
        ) : (
          <GoogleSignIn />
        )}
      </div>

      <KeyboardShortcutGuide 
        isOpen={showShortcutGuide} 
        onClose={() => setShowShortcutGuide(false)} 
      />

      <ExportModal
        isOpen={showExportModal}
        onRequestClose={() => setShowExportModal(false)}
        onExport={onExport}
        notes={notes}
      />
    </header>
  );
};

export default Header;
