import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const NoteEditor = ({ initialContent, onChange }) => {
  const [content, setContent] = useState(initialContent || '');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
    onChange(data);
  };

  return (
    <CKEditor
  editor={ClassicEditor}
  config={{
    ckfinder: {
      uploadUrl: 'http://localhost:5000/upload',  // Make sure this URL is correct
    },
  }}
  data={content}
  onChange={handleEditorChange}
/>

  );
};

export default NoteEditor;
