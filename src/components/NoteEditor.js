import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './NoteEditor.css'

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
        toolbar: [
          'heading', '|',
          'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
          'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
          'insertTable', 'imageUpload', 'mediaEmbed', '|',
          'undo', 'redo', '|',
          'alignment', 'fontColor', 'fontBackgroundColor', '|',
          'indent', 'outdent', '|',
          'fullScreen', 'removeFormat'
        ],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
        },
        ckfinder: {
          uploadUrl: 'http://localhost:5000/upload',
        }
      }}
      data={content}
      onChange={handleEditorChange}
    />

  );
};

export default NoteEditor;
