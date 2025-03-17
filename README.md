# EzNoteManagerPro

A professional note-taking application with encryption and cloud synchronization.

## Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/eznotemanagerpro.git
cd eznotemanagerpro
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
```bash
cp .env.example .env
```
- Fill in your Firebase configuration values in `.env`

4. Start the development server
```bash
npm start
```

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**Note:** Never commit the `.env` file to version control. It contains sensitive information.

## Security

This project uses environment variables to handle sensitive data. The actual values should never be committed to the repository. Instead:

1. Use environment variables for all sensitive data
2. Keep `.env` in your `.gitignore`
3. Use `.env.example` as a template
4. Set up proper Firebase security rules
5. Configure API key restrictions in Google Cloud Console

## Deployment

1. Build the project
```bash
npm run build
```

2. Deploy to Firebase
```bash
firebase deploy
```

Make sure to set up your environment variables in your deployment platform.

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
