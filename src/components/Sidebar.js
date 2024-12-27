import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faTag, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import { removeUserTag } from '../firebase/notes';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const availableColors = [
  'bg-gray-800', 'bg-blue-200', 'bg-red-500', 'bg-yellow-200', 'bg-blue-500', 
  'bg-gray-300', 'bg-purple-300', 'bg-green-200', 'bg-orange-200', 'bg-teal-200', 
  'bg-red-300', 'bg-yellow-300', 'bg-pink-300', 'bg-indigo-300', 'bg-gray-400', 
  'bg-lime-200'
];

const Sidebar = ({ categories, setCategories, onCategorySelect, notes, setNotes, tags, setShowTagManager, onTagSelect, selectedCategory, selectedTag }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, tag: null });
  const contextMenuRef = useRef(null);
  const [user] = useAuthState(auth);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    const newCategory = {
      name: newCategoryName,
      color: selectedColor,
    };
    const updatedCategories = [...categories.slice(0, categories.length - 1), newCategory, categories[categories.length - 1]];
    setCategories(updatedCategories);
    setNewCategoryName('');
    setSelectedColor(availableColors[0]);
  };

  const handleEditCategory = (index) => {
    const updatedCategories = categories.map((category, i) => 
      i === index ? { ...category, name: newCategoryName, color: selectedColor } : category
    );
    setCategories(updatedCategories);
    setIsEditing(false);
    setCategoryToEdit(null);
    setNewCategoryName('');
    setSelectedColor(availableColors[0]);
  };

  const handleDeleteCategory = (index) => {
    const categoryName = categories[index].name;
    if (categoryName === 'Uncategorized' || categoryName === 'All Notes') {
      alert(`The category "${categoryName}" cannot be deleted.`);
      return;
    }

    const notesInCategory = notes.filter(note => note.category === categoryName);
    if (notesInCategory.length > 0) {
      const confirmDelete = window.confirm(
        `The category "${categoryName}" contains ${notesInCategory.length} note${notesInCategory.length > 1 ? 's' : ''}. ` +
        `If you delete this category, the notes will also be removed. Do you want to proceed?`
      );

      if (confirmDelete) {
        const updatedCategories = categories.filter((_, i) => i !== index);
        const updatedNotes = notes.filter(note => note.category !== categoryName);
        setCategories(updatedCategories);
        setNotes(updatedNotes);
      } else {
        alert(`Please change the category of the notes in "${categoryName}" before deleting the category.`);
      }
    } else {
      const confirmDelete = window.confirm(`Are you sure you want to delete the category "${categoryName}"?`);
      if (confirmDelete) {
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
      }
    }
  };

  const startEditing = (category, index) => {
    setIsEditing(true);
    setCategoryToEdit(index);
    setNewCategoryName(category.name);
    setSelectedColor(category.color);
  };

  const handleDragStart = (e, tag) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', tag);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleTagRightClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      tag: tag
    });
  };

  const handleTagDelete = async (tag) => {
    if (user) {
      try {
        const success = await removeUserTag(user.uid, tag);
        if (success) {
          setContextMenu({ visible: false, x: 0, y: 0, tag: null });
          // If the deleted tag is currently selected, clear the selection
          if (selectedTag?.includes(tag)) {
            onTagSelect(tag);
          }
        }
      } catch (error) {
        console.error('Error removing tag:', error);
      }
    }
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, tag: null });
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.visible]);

  return (
    <aside className="bg-transparent text-gray-300 w-64 p-4 border-r border-blue-950 flex flex-col h-full">
      <nav className="space-y-2 bg-blue-900 rounded-xl flex-grow">
        {/* Categories Section */}
        <div className="category-section">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded hover:bg-gray-600 text-gray-300 group relative cursor-pointer ${selectedCategory === category.name ? 'bg-gray-600 ring-2 ring-yellow-500' : ''}`}
              onClick={() => onCategorySelect(category.name)}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                <span>{category.name}</span>
              </div>
              {category.name !== 'Uncategorized' && category.name !== 'All Notes' && (
                <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex space-x-2">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-gray-400 hover:text-white cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); startEditing(category, index);}}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={(e) => {e.stopPropagation(); handleDeleteCategory(index);}}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="mt-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={isEditing ? "Edit Category" : "New Category"}
              className="bg-gray-700 text-white p-2 mb-2 rounded border border-gray-300 w-full"
            />
            <div className="flex space-x-2 mb-2">
              {availableColors.map((color, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${color} cursor-pointer ${selectedColor === color ? 'ring-2 ring-white' : ''}`}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
            <button
              onClick={isEditing ? () => handleEditCategory(categoryToEdit) : handleAddCategory}
              className="mt-2 block w-full p-2 rounded bg-blue-700 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} /> {isEditing ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </div>

        {/* Tags Section */}
        <div className="tag-section mt-8">
          <h3 className="text-lg font-semibold text-white mb-2">Filter by Tag</h3>
          <div className="flex flex-wrap max-h-40 overflow-y-auto">
            {tags.map((tag, index) => (
              <span
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, tag)}
                onContextMenu={(e) => handleTagRightClick(e, tag)}
                className={`bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-2 mb-2 cursor-pointer hover:bg-gray-300 ${
                  selectedTag?.includes(tag) ? 'ring-2 ring-yellow-500 bg-gray-300' : ''
                }`}
                onClick={() => onTagSelect(tag)}
              >
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
          {selectedTag?.length > 0 && (
            <button
              onClick={() => onTagSelect(null)}
              className="mt-2 block w-full p-2 rounded bg-red-600 text-white hover:bg-red-500"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Context Menu */}
        {contextMenu.visible && (
          <ul
            ref={contextMenuRef}
            className="fixed bg-white shadow-lg rounded-md py-2 z-50"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
              onClick={() => handleTagDelete(contextMenu.tag)}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Delete Tag
            </li>
          </ul>
        )}

        <div className="mt-4">
          <button
            onClick={() => setShowTagManager(true)}
            className="mt-2 block w-full p-2 rounded bg-blue-700 text-white hover:bg-blue-600"
          >
            Manage Tags
          </button>
        </div>
      </nav>

      {/* Archived Notes Section */}
      <div className="mt-auto"> 
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
          <FontAwesomeIcon icon={faBoxArchive} className="mr-2" />
          Archived Notes
        </h3>
        <div
          className="p-2 rounded hover:bg-gray-600 text-gray-300 cursor-pointer"
          onClick={() => onCategorySelect('Archived')}
        >
          View Archived Notes
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
