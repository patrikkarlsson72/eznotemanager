import { useEffect } from 'react';

const KeyboardShortcuts = ({ 
  onCreateNote, 
  onFocusSearch, 
  onSaveNote, 
  onCloseModal,
  isModalOpen 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Create new note: Ctrl+Alt+N
      if (isCtrlOrCmd && e.altKey && key === 'n') {
        e.preventDefault();
        e.stopPropagation();
        onCreateNote();
        return false;
      }

      // Focus search: Ctrl+Alt+F
      if (isCtrlOrCmd && e.altKey && key === 'f') {
        e.preventDefault();
        e.stopPropagation();
        onFocusSearch();
        return false;
      }

      // Save note: Ctrl+Alt+S
      if (isCtrlOrCmd && e.altKey && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        console.log('Save shortcut triggered, modal open:', isModalOpen);
        if (isModalOpen) {
          try {
            const result = onSaveNote();
            console.log('Save result:', result);
            if (result) {
              return false; // Stop event propagation if save was successful
            }
          } catch (error) {
            console.error('Error during save:', error);
          }
        }
        return false;
      }

      // Close modal: Esc
      if (e.key === 'Escape' && isModalOpen) {
        e.preventDefault();
        e.stopPropagation();
        onCloseModal();
        return false;
      }
    };

    const options = { capture: true, passive: false };
    document.addEventListener('keydown', handleKeyDown, options);
    window.addEventListener('keydown', handleKeyDown, options);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, options);
      window.removeEventListener('keydown', handleKeyDown, options);
    };
  }, [onCreateNote, onFocusSearch, onSaveNote, onCloseModal, isModalOpen]);

  return null;
};

export default KeyboardShortcuts; 