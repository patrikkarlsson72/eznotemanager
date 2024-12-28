# File Attachments in EzNoteManager

## Overview
The file attachment feature allows users to attach any type of file to their notes. Files are stored in Firebase Storage and displayed as clickable links within the note.

## Features
- Upload any file type
- Secure storage in Firebase
- Files organized by user ID
- Visual representation with file name and download link
- File size limit of 10MB (configurable in storage rules)

## Implementation Details

### 1. Firebase Storage Setup
Files are stored in Firebase Storage under the following path:
```
{userId}/files/{timestamp}_{filename}
```

### 2. Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{userId}/files/{fileId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024; // 10MB max file size
    }
  }
}
```

### 3. TipTap Extension
The file attachment feature is implemented as a custom TipTap extension (`FileAttachment`) with the following key components:

```javascript
const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  selectable: true,
  draggable: true,
  inline: false,
  
  // Attributes for storing file metadata
  addAttributes() {
    return {
      filename: {
        default: null,
        parseHTML: element => element.querySelector('.filename')?.textContent,
        renderHTML: attributes => ({
          'data-filename': attributes.filename
        }),
      },
      url: {
        default: null,
        parseHTML: element => element.querySelector('a')?.href,
        renderHTML: attributes => ({
          'data-url': attributes.url
        }),
      },
      size: {
        default: null,
        parseHTML: element => element.dataset.filesize,
        renderHTML: attributes => ({
          'data-filesize': attributes.size
        }),
      }
    };
  }
});
```

### 4. Usage in Code

To add file upload functionality to a component:

```javascript
// Add file input reference
const fileInputRef = React.useRef(null);

// Add upload handler
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  
  if (file && auth.currentUser) {
    try {
      const downloadURL = await uploadFile(file, auth.currentUser.uid);
      editor.chain().focus().setFileAttachment({ 
        filename: file.name,
        url: downloadURL,
        size: file.size
      }).run();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

// Add file input to your JSX
<input
  ref={fileInputRef}
  type="file"
  onChange={handleFileUpload}
  className="hidden"
/>
```

## Styling
File attachments are styled with Tailwind CSS classes to match the application's theme:

```html
<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 my-2">
  <span class="text-lg">📎</span>
  <div class="flex flex-col">
    <span class="text-sm font-medium filename">[Filename]</span>
    <a class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
      Download
    </a>
  </div>
</div>
```

## Security Considerations
1. Only authenticated users can upload files
2. Users can only upload to their own directory
3. File size is limited to 10MB
4. File access is restricted to authenticated users

## Future Improvements
Potential enhancements to consider:
1. File type restrictions
2. Progress indicator during upload
3. File preview for supported types
4. File deletion capability
5. File organization by folders
6. Drag and drop file upload support 