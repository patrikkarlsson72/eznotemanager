# EzNoteManagerPro

A powerful and intuitive note-taking application built with React and Firebase, featuring rich text editing, end-to-end encryption, and real-time synchronization.

Visit the live application at [eznotemanagerpro.com](https://eznotemanagerpro.com)

## Features

### Core Functionality
- 📝 Rich text editor with Markdown support
- 🔒 Optional end-to-end encryption
- 📁 Category-based organization
- 🏷️ Tag system for easy filtering
- 🔍 Advanced search capabilities
- 📱 Responsive design

### Advanced Features
- 💻 Code block support with syntax highlighting
- ✅ Task lists and checkboxes
- 🖼️ Image uploads with optimization
- 📎 File attachments
- 📤 Export to PDF/Markdown
- 📥 Import from various formats
- 🌓 Dark/Light theme support
- ⌨️ Keyboard shortcuts

### Technical Features
- 🔄 Real-time synchronization
- 🔌 Offline support
- 📊 Google Analytics integration
- 🔐 Secure Firebase authentication
- ⚡ Optimized performance
- 💾 Automatic data backup

## Security Measures

### API and Authentication
- Firebase API key restrictions implemented for authorized domains:
  - Local development (`localhost:3000`)
  - Firebase hosting domains (`eznotemanager-95745.firebaseapp.com`, `eznotemanager-95745.web.app`)
  - Production domains (`eznotemanagerpro.com`, `www.eznotemanagerpro.com`)
- Environment variables used for all sensitive configuration
- No hardcoded credentials in the codebase

### Environment Configuration
1. Copy `.env.example` to `.env`
2. Add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

### Security Best Practices
- `.env` files excluded from version control
- API access restricted to specific services:
  - Firebase Management API
  - Identity Toolkit API
  - Cloud Firestore API
  - Cloud Storage for Firebase API
- Firebase security rules implemented
- Regular security audits performed
- Dependencies kept up to date

## Technology Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Editor**: TipTap
- **Authentication**: Google Sign-In
- **Analytics**: Google Analytics 4
- **Hosting**: Firebase Hosting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eznotemanagerpro.git
cd eznotemanagerpro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `firebase deploy` - Deploys to Firebase hosting

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Google provider)
3. Create a Firestore database
4. Set up Firebase Storage
5. Configure Firebase Hosting
6. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Patrik Karlsson - [LinkedIn](https://www.linkedin.com/in/patrik-karlsson-808b5855/)

Project Link: [https://github.com/yourusername/eznotemanagerpro](https://github.com/yourusername/eznotemanagerpro)

## Acknowledgments

- [React.js](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TipTap](https://tiptap.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- All other open-source libraries used in this project
