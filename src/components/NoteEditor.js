import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './NoteEditor.css';

const NoteEditor = ({ initialContent, onChange }) => {
  const [content, setContent] = useState(initialContent || '');

  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: () => {
          return loader.file.then((file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({ default: reader.result });
              };
              reader.onerror = (error) => {
                reject(error);
              };
              reader.readAsDataURL(file);
            });
          });
        },
        abort: () => {
          console.log('Upload aborted');
        }
      };
    };
  }

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
    onChange(data);
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [CustomUploadAdapterPlugin],
        toolbar: [
          'heading', '|',
          'markdown', '|',
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
        }
      }}
      data={content}
      onChange={handleEditorChange}
    />
  );
};

export default NoteEditor;
