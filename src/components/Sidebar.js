import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const availableColors = [
  'bg-gray-800', 'bg-blue-200', 'bg-red-500', 'bg-yellow-200', 'bg-blue-500', 
  'bg-gray-300', 'bg-purple-300', 'bg-green-200', 'bg-orange-200', 'bg-teal-200', 
  'bg-red-300', 'bg-yellow-300', 'bg-pink-300', 'bg-indigo-300', 'bg-gray-400', 
  'bg-lime-200'
];

const Sidebar = ({ categories, setCategories, onCategorySelect, notes, setNotes }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(availableColors[0]); // Default to first color
  const [isEditing, setIsEditing] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return; // Prevent empty categories
    const newCategory = {
      name: newCategoryName,
      color: selectedColor, // Use the selected color
    };
    // Insert the new category before the last element ("Uncategorized")
    const updatedCategories = [...categories.slice(0, categories.length - 1), newCategory, categories[categories.length - 1]];
    setCategories(updatedCategories);
    setNewCategoryName('');
    setSelectedColor(availableColors[0]); // Reset to default color after adding
  };

  const handleEditCategory = (index) => {
    const updatedCategories = categories.map((category, i) => 
      i === index ? { ...category, name: newCategoryName, color: selectedColor } : category
    );
    setCategories(updatedCategories);
    setIsEditing(false);
    setCategoryToEdit(null);
    setNewCategoryName('');
    setSelectedColor(availableColors[0]); // Reset to default color after editing
  };

  const handleDeleteCategory = (index) => {
    const categoryName = categories[index].name;
  
    // Prevent deletion of "Uncategorized" and "All Notes" categories
    if (categoryName === 'Uncategorized' || categoryName === 'All Notes') {
      alert(`The category "${categoryName}" cannot be deleted.`);
      return;
    }
  
    console.log(`Attempting to delete category: ${categoryName}`);
  
    // Check if there are any notes in this category
    const notesInCategory = notes.filter(note => note.category === categoryName);
  
    console.log(`Notes in this category: `, notesInCategory);
  
    if (notesInCategory.length > 0) {
      const confirmDelete = window.confirm(
        `The category "${categoryName}" contains ${notesInCategory.length} note${notesInCategory.length > 1 ? 's' : ''}. ` +
        `If you delete this category, the notes will also be removed. Do you want to proceed?`
      );
  
      if (confirmDelete) {
        // Delete both the category and the notes in it
        const updatedCategories = categories.filter((_, i) => i !== index);
        const updatedNotes = notes.filter(note => note.category !== categoryName);
  
        setCategories(updatedCategories);
        setNotes(updatedNotes);
  
        // Persist the updated categories and notes in localStorage
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
  
        console.log(`Category and associated notes deleted.`);
      } else {
        // User canceled the deletion, do nothing
        alert(`Please change the category of the notes in "${categoryName}" before deleting the category.`);
      }
    } else {
      // No notes in this category, safe to delete
      const confirmDelete = window.confirm(`Are you sure you want to delete the category "${categoryName}"?`);
  
      if (confirmDelete) {
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
  
        // Persist the updated categories in localStorage
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
  
        console.log(`Category deleted successfully.`);
      }
    }
  };
  
  
  

  const startEditing = (category, index) => {
    setIsEditing(true);
    setCategoryToEdit(index);
    setNewCategoryName(category.name);
    setSelectedColor(category.color);
  };

  return (
    <aside className="bg-transperant text-gray-300 w-64 p-4 border-r border-blue-950">
      <nav className="space-y-2 bg-blue-900 rounded-xl">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-600 text-gray-300 group relative cursor-pointer"
            onClick={() => onCategorySelect(category.name)}  // Select category on click
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
              <span>{category.name}</span>
            </div>
            {/* Only show edit and delete icons for categories other than "Uncategorized" and "All Notes" */}
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

        {/* Create or Edit Category */}
        <div className="mt-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder={isEditing ? "Edit Category" : "New Category"}
            className="bg-gray-700 text-white p-2 mb-2 rounded border border-gray-300 w-full"
          />
          
          {/* Color Picker */}
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
      </nav>
    </aside>
  );
};

export default Sidebar;
