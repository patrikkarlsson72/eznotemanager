# Ez Note Manager

Ez Note Manager is a web application designed to help users efficiently manage and organize their notes. It leverages modern web technologies to provide a seamless and interactive user experience.

## Features

- **Advanced Rich Text Editing**: Feature-rich text editor powered by TipTap with support for:
  - Markdown-style formatting
  - Code blocks with syntax highlighting
  - Task lists and checkboxes
  - Image uploads with Firebase Storage integration
  - File attachments
  - Links and highlights
  - Real-time content updates
- **End-to-End Encryption**: Secure note content with AES-GCM encryption before saving to Firebase, with client-side encryption key management.
- **Firebase Integration**: Store and manage notes securely in the cloud using Firebase.
- **Offline Support**: Enhanced caching for better offline functionality and data persistence.
- **Image Optimization**: Optimized image loading and storage for better performance.
- **Drag and Drop**: Organize notes easily with drag-and-drop functionality powered by `react-beautiful-dnd`.
- **Responsive Design**: Styled with TailwindCSS to ensure a responsive and visually appealing interface across devices.
- **Routing**: Navigate through different sections of the application using `react-router-dom`.
- **Authentication**: Secure user authentication with Firebase and `react-firebase-hooks`.
- **Modular Components**: Built with React components for easy maintenance and scalability.

## Technologies Used

- **React.js**: For building the user interface.
- **Firebase**: Backend services for authentication and data storage.
- **Firebase Storage**: For image and file uploads.
- **TailwindCSS**: Utility-first CSS framework for styling.
- **TipTap**: Headless editor framework based on ProseMirror.
- **React Beautiful DnD**: For drag-and-drop functionality.
- **Web Crypto API**: For secure client-side encryption operations.
- **IndexedDB**: For local data caching and offline support. 