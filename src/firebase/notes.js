import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  orderBy,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  writeBatch
} from 'firebase/firestore';

// Collection references
const notesCollection = collection(db, 'notes');
const usersCollection = collection(db, 'users');

// Add a new note
export const addNote = async (note) => {
  try {
    // Get all notes to find the highest order
    const q = query(
      notesCollection,
      where("userId", "==", note.userId)
    );
    const querySnapshot = await getDocs(q);
    let maxOrder = 0;
    querySnapshot.forEach((doc) => {
      const noteData = doc.data();
      maxOrder = Math.max(maxOrder, noteData.order || 0);
    });

    // Create the new note with order field
    const noteWithOrder = {
      ...note,
      order: maxOrder + 1000,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(notesCollection, noteWithOrder);
    console.log("Note added successfully:", docRef.id);

    // Update user's tags
    if (note.tags && note.tags.length > 0) {
      await updateUserTags(note.userId, note.tags);
    }

    return { ...noteWithOrder, id: docRef.id };
  } catch (error) {
    console.error("Error adding note: ", error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, noteData) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: Timestamp.now()
    });
    console.log("Note updated successfully:", noteId);

    // Update user's tags
    if (noteData.tags && noteData.userId) {
      await updateUserTags(noteData.userId, noteData.tags);
    }

    return { ...noteData, id: noteId };
  } catch (error) {
    console.error("Error updating note: ", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
    console.log("Note deleted successfully:", noteId);
    return noteId;
  } catch (error) {
    console.error("Error deleting note: ", error);
    throw error;
  }
};

// Get all notes for a user
export const getNotes = async (userId) => {
  try {
    const q = query(
      notesCollection,
      where("userId", "==", userId),
      orderBy("pinned", "desc"),
      orderBy("order", "asc"),
      orderBy("__name__", "asc")
    );
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      const note = { id: doc.id, ...doc.data() };
      notes.push(note);
    });
    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Subscribe to notes updates with ordering
export const subscribeToNotes = (userId, callback) => {
  console.log("Subscribing to notes for user:", userId);
  
  if (!userId) {
    console.error("No userId provided to subscribeToNotes");
    callback([]);
    return () => {};
  }

  const q = query(
    notesCollection,
    where("userId", "==", userId),
    orderBy("pinned", "desc"),
    orderBy("order", "asc"),
    orderBy("__name__", "asc")
  );

  const unsubscribe = onSnapshot(q, 
    (snapshot) => {
      console.log("Received snapshot with changes");
      const notes = [];
      snapshot.forEach((doc) => {
        const note = { id: doc.id, ...doc.data() };
        notes.push(note);
      });
      console.log("Processed notes:", notes.length);
      callback(notes);
    }, 
    (error) => {
      console.error("Error in notes subscription:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

// Get user's tags
export const getUserTags = async (userId) => {
  try {
    const userRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().tags || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting user tags:", error);
    throw error;
  }
};

// Subscribe to user's tags
export const subscribeToUserTags = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const userRef = doc(usersCollection, userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().tags || []);
    } else {
      callback([]);
    }
  });
};

// Update user's tags
export const updateUserTags = async (userId, newTags) => {
  try {
    const userRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const existingTags = userDoc.data().tags || [];
      const uniqueTags = [...new Set([...existingTags, ...newTags])];
      await updateDoc(userRef, { tags: uniqueTags });
    } else {
      await setDoc(userRef, { tags: newTags });
    }
  } catch (error) {
    console.error("Error updating user tags:", error);
    throw error;
  }
};

// Remove a tag from user's tags
export const removeUserTag = async (userId, tag) => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, {
      tags: arrayRemove(tag)
    });
  } catch (error) {
    console.error("Error removing user tag:", error);
    throw error;
  }
};

// Get user's categories
export const getUserCategories = async (userId) => {
  try {
    const userRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().categories || getDefaultCategories();
    }
    return getDefaultCategories();
  } catch (error) {
    console.error("Error getting user categories:", error);
    throw error;
  }
};

// Subscribe to user's categories
export const subscribeToUserCategories = (userId, callback) => {
  if (!userId) {
    callback(getDefaultCategories());
    return () => {};
  }

  const userRef = doc(usersCollection, userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().categories || getDefaultCategories());
    } else {
      callback(getDefaultCategories());
    }
  });
};

// Update user's categories
export const updateUserCategories = async (userId, categories) => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, { categories });
  } catch (error) {
    console.error("Error updating user categories:", error);
    throw error;
  }
};

// Create example notes for new users
export const createExampleNotes = async (userId) => {
  try {
    console.log('Starting to create example notes for user:', userId);
    
    const exampleNotes = [
      {
        userId,
        title: "📝 Project Ideas",
        content: "Here are some project ideas for 2024:\n\n" +
                "• Mobile app for fitness tracking\n" +
                "• E-commerce website redesign\n" +
                "• Smart home automation system\n" +
                "• AI-powered task manager\n\n" +
                "Remember to prioritize based on market research!",
        category: "Work/Projects",
        tags: ["projects", "ideas", "planning"],
        pinned: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        userId,
        title: "🎯 Weekly Goals",
        content: "Goals for this week:\n\n" +
                "✅ Complete project documentation\n" +
                "✅ Team meeting on Wednesday\n" +
                "⬜ Review pull requests\n" +
                "⬜ Update client presentation\n\n" +
                "Don't forget to update progress daily!",
        category: "Personal",
        tags: ["goals", "tasks", "weekly"],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        userId,
        title: "💡 Meeting Notes",
        content: "Client Meeting - Website Redesign\n\n" +
                "Key Points:\n" +
                "• Modern, minimalist design\n" +
                "• Mobile-first approach\n" +
                "• Improved user navigation\n" +
                "• Performance optimization\n\n" +
                "Next Steps:\n" +
                "1. Create wireframes\n" +
                "2. Design mockups\n" +
                "3. Client review",
        category: "Work/Projects",
        tags: ["meeting", "client", "design"],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    // Add each example note individually with retry logic
    for (const note of exampleNotes) {
      // Wait 2 seconds between each note creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let retries = 3;
      while (retries > 0) {
        try {
          console.log('Adding note:', note.title);
          // Use addNote instead of addDoc to ensure proper order handling
          const newNote = await addNote(note);
          console.log('Note added successfully:', newNote.id);
          break; // Success, exit retry loop
        } catch (error) {
          console.error(`Error adding note (${retries} retries left):`, error);
          retries--;
          if (retries === 0) throw error;
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    console.log("All example notes created successfully");

    // Update user's tags
    const allTags = [...new Set(exampleNotes.flatMap(note => note.tags))];
    await updateUserTags(userId, allTags);
    console.log("User tags updated with example tags");

  } catch (error) {
    console.error("Error creating example notes:", error);
    throw error;
  }
};

// Initialize new user
export const initializeNewUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    // Only return true if this is actually a new user
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        categories: getDefaultCategories(),
        tags: [],
        createdAt: Timestamp.now()
      });
      return true;
    }
    
    // Existing user, don't show welcome guide
    return false;
  } catch (error) {
    console.error('Error initializing user:', error);
    return false;
  }
};

// Helper function to get default categories
const getDefaultCategories = () => [
  { name: 'All Notes', color: 'bg-gray-300' },
  { name: 'Personal', color: 'bg-blue-200' },
  { name: 'Work/Projects', color: 'bg-green-200' },
  { name: 'Ideas', color: 'bg-yellow-200' },
  { name: 'Uncategorized', color: 'bg-gray-300' }
];

// Update note order
export const updateNoteOrder = async (noteId, newOrder) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      order: newOrder,
      updatedAt: Timestamp.now()
    });
    return noteId;
  } catch (error) {
    console.error("Error updating note order:", error);
    throw error;
  }
}; 