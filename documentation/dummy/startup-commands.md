# EzNoteManager Startup Commands

## Development Environment Setup

### 1. Start the React Development Server
```bash
npm start
```
This starts the React application on http://localhost:3000

### 2. Start the Express File Upload Server
```bash
node server.js
```
This starts the Express server on http://localhost:5000
- Required for handling image uploads in notes
- Must be running alongside the React server for full functionality

## What Each Server Does

### React Server (Port 3000)
- Serves the main application interface
- Handles note management
- Manages authentication with Firebase
- Stores notes in localStorage

### Express Server (Port 5000)
- Handles file uploads (especially images)
- Stores uploaded files in the 'uploads' directory
- Serves uploaded files back to the application

## Additional Commands

### Install Dependencies
```bash
npm install
```
Run this after cloning the repository or when new dependencies are added

### Firebase Commands
```bash
firebase login        # Login to Firebase
firebase init        # Initialize Firebase in the project
firebase deploy      # Deploy the application
```

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the 'build' folder

## Troubleshooting

If images aren't uploading in notes:
1. Check if the Express server (node server.js) is running
2. Ensure both servers (React and Express) are running simultaneously
3. Check if the 'uploads' directory exists in the project root 