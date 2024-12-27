import React from 'react';

const KeyboardShortcutGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'Alt', 'N'], description: 'Create new note' },
    { keys: ['Ctrl/Cmd', 'Alt', 'F'], description: 'Focus search' },
    { keys: ['Ctrl/Cmd', 'Alt', 'S'], description: 'Save current note' },
    { keys: ['Esc'], description: 'Close modals' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-300">
              <div className="flex gap-2">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <kbd className="px-2 py-1 bg-white border border-gray-400 rounded text-sm text-gray-900 shadow">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && <span className="text-gray-700">+</span>}
                  </React.Fragment>
                ))}
              </div>
              <span className="text-gray-900">{shortcut.description}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutGuide; 