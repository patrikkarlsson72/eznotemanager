import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Node } from '@tiptap/core';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, faItalic, faCode, faListUl, 
  faListOl, faHighlighter, faQuoteLeft,
  faHeading, faUndo, faRedo, faImage,
  faPaperclip, faSquareCheck, faLink,
  faFileExport
} from '@fortawesome/free-solid-svg-icons';
import styles from './TipTapEditor.module.css';
import MarkdownIt from 'markdown-it';
import { uploadImage, uploadFile } from '../firebase/storage';
import { auth } from '../firebase';
import { createPortal } from 'react-dom';

const md = new MarkdownIt();

// Custom File Attachment Extension
const getFileIcon = (type, mimeType) => {
  if (type === 'video') return '🎥';
  if (type === 'audio') return '🎵';
  if (type === 'pdf') return '📄';
  if (type.startsWith('image')) return '🖼️';
  if (mimeType?.includes('word')) return '📝';
  if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet')) return '📊';
  if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return '📽️';
  return '📎';
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
};

const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'block',
  selectable: true,
  draggable: true,
  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  
  addAttributes() {
    return {
      filename: {
        default: null,
      },
      url: {
        default: null,
      },
      size: {
        default: null,
      },
      type: {
        default: 'file',
      },
      mimeType: {
        default: null,
      }
    };
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="file-attachment"]',
      getAttrs: (element) => {
        const link = element.querySelector('a');
        const filenameDiv = element.querySelector('.text-sm.font-medium');
        const fileSizeDiv = element.querySelector('.text-xs.text-gray-500');
        
        return {
          filename: filenameDiv?.textContent,
          url: link?.href,
          size: fileSizeDiv?.getAttribute('data-size'),
          type: element.getAttribute('data-file-type') || 'file',
          mimeType: element.getAttribute('data-mime-type')
        };
      }
    }];
  },

  renderHTML({ node }) {
    const previewContent = (() => {
      if (node.attrs.type === 'video') {
        return [
          'video',
          {
            src: node.attrs.url,
            controls: 'true',
            class: 'w-full max-h-48 rounded',
            style: 'max-width: 400px;'
          }
        ];
      }
      if (node.attrs.type === 'audio') {
        return [
          'audio',
          {
            src: node.attrs.url,
            controls: 'true',
            class: 'w-full',
            style: 'max-width: 400px;'
          }
        ];
      }
      if (node.attrs.type === 'image') {
        return [
          'img',
          {
            src: node.attrs.url,
            class: 'max-h-48 rounded object-contain',
            style: 'max-width: 400px;'
          }
        ];
      }
      return null;
    })();

    return [
      'div', 
      { 
        class: 'relative flex flex-col p-4 my-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group',
        'data-type': 'file-attachment',
        'data-file-type': node.attrs.type,
        'data-mime-type': node.attrs.mimeType
      },
      [
        'button',
        {
          class: 'absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center text-xl font-bold border-2 border-white dark:border-gray-800',
          'data-delete': 'true'
        },
        '×'
      ],
      ...(previewContent ? [[
        'div',
        { class: 'mb-3 flex justify-center' },
        previewContent
      ]] : []),
      [
        'a',
        {
          href: node.attrs.url,
          download: node.attrs.filename,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'flex items-center space-x-3 w-full text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
        },
        [
          'span',
          { class: 'text-2xl' },
          getFileIcon(node.attrs.type, node.attrs.mimeType)
        ],
        [
          'div',
          { class: 'flex-1' },
          [
            'div',
            { class: 'text-sm font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors' },
            node.attrs.filename
          ],
          [
            'div',
            { 
              class: 'text-xs text-gray-500 dark:text-gray-400',
              'data-size': node.attrs.size
            },
            formatFileSize(node.attrs.size)
          ]
        ]
      ]
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.className = 'relative flex flex-col p-4 my-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group';
      dom.setAttribute('data-type', 'file-attachment');

      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = '×';
      deleteButton.className = 'absolute top-0 right-0 -mt-3 -mr-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg z-50 flex items-center justify-center text-xl font-bold border-2 border-white dark:border-gray-800';
      
      deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos === 'function') {
          editor.commands.deleteRange({ from: getPos(), to: getPos() + 1 });
        }
      });

      // Add preview content if applicable
      if (node.attrs.type === 'video') {
        const preview = document.createElement('div');
        preview.className = 'mb-3 flex justify-center';
        const video = document.createElement('video');
        video.src = node.attrs.url;
        video.controls = true;
        video.className = 'w-full max-h-48 rounded';
        video.style.maxWidth = '400px';
        preview.appendChild(video);
        dom.appendChild(preview);
      } else if (node.attrs.type === 'audio') {
        const preview = document.createElement('div');
        preview.className = 'mb-3 flex justify-center';
        const audio = document.createElement('audio');
        audio.src = node.attrs.url;
        audio.controls = true;
        audio.className = 'w-full';
        audio.style.maxWidth = '400px';
        preview.appendChild(audio);
        dom.appendChild(preview);
      } else if (node.attrs.type === 'image') {
        const preview = document.createElement('div');
        preview.className = 'mb-3 flex justify-center';
        const img = document.createElement('img');
        img.src = node.attrs.url;
        img.className = 'max-h-48 rounded object-contain';
        img.style.maxWidth = '400px';
        preview.appendChild(img);
        dom.appendChild(preview);
      }

      // Add file info container with download link
      const link = document.createElement('a');
      link.href = node.attrs.url;
      link.download = node.attrs.filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'flex items-center space-x-3 w-full text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400';
      
      const icon = document.createElement('span');
      icon.className = 'text-2xl';
      icon.textContent = getFileIcon(node.attrs.type, node.attrs.mimeType);
      link.appendChild(icon);

      const details = document.createElement('div');
      details.className = 'flex-1';
      
      const fileName = document.createElement('div');
      fileName.className = 'text-sm font-medium group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors';
      fileName.textContent = node.attrs.filename;
      details.appendChild(fileName);

      const fileSize = document.createElement('div');
      fileSize.className = 'text-xs text-gray-500 dark:text-gray-400';
      fileSize.textContent = formatFileSize(node.attrs.size);
      details.appendChild(fileSize);

      link.appendChild(details);

      // Important: Append elements in the correct order
      dom.appendChild(deleteButton);
      dom.appendChild(link);

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== node.type.name) return false;
          fileName.textContent = updatedNode.attrs.filename;
          fileSize.textContent = formatFileSize(updatedNode.attrs.size);
          link.href = updatedNode.attrs.url;
          return true;
        },
      };
    };
  },

  addCommands() {
    return {
      setFileAttachment: attributes => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes
        });
      },
    };
  },
});

// Add custom image extension with resizing
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...Image.config.addAttributes(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
          style: `width: ${attributes.width}`,
        }),
      },
      height: {
        default: 'auto',
        renderHTML: attributes => ({
          height: attributes.height,
          style: `height: ${attributes.height}`,
        }),
      },
    }
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const container = document.createElement('div');
      container.className = 'image-resizer';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.className = 'rounded-lg max-w-full h-auto resize-image';
      img.style.width = node.attrs.width;
      img.style.height = node.attrs.height;

      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'resize-handle';

      container.append(img, resizeHandle);

      let startX, startWidth;

      resizeHandle.addEventListener('mousedown', e => {
        e.preventDefault();
        startX = e.pageX;
        startWidth = img.offsetWidth;
        
        const onMouseMove = moveEvent => {
          const currentX = moveEvent.pageX;
          const diffX = currentX - startX;
          const newWidth = startWidth + diffX;
          img.style.width = `${newWidth}px`;
        };
        
        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          
          if (typeof getPos === 'function') {
            editor.commands.updateAttributes('image', {
              width: img.style.width,
            }, { at: getPos() });
          }
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      return {
        dom: container,
        update: updatedNode => {
          if (updatedNode.type.name !== 'image') return false;
          img.src = updatedNode.attrs.src;
          return true;
        },
      };
    };
  },
});

const MenuBar = ({ editor, onExport }) => {
  const { theme } = useTheme();
  const imageInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showExportMenu, setShowExportMenu] = React.useState(false);
  const exportButtonRef = React.useRef(null);
  const exportMenuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target) &&
          exportButtonRef.current && !exportButtonRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const input = imageInputRef.current;
    if (input) {
      input.click();
    }
  };

  const addFile = () => {
    const input = fileInputRef.current;
    if (input) {
      input.click();
    }
  };

  const addLink = () => {
    const selection = editor.state.selection;
    const selectedText = selection.empty 
      ? '' 
      : editor.state.doc.textBetween(selection.from, selection.to);

    if (selectedText) {
      setLinkUrl('');
      setIsLinkModalOpen(true);
    } else {
      const url = window.prompt('Enter URL:');
      if (url) {
        // If no text is selected, insert the URL as the text
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: url,
          })
          .setLink({ href: url })
          .run();
      }
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      // If text is selected, convert it to a link
      if (!editor.state.selection.empty) {
        editor
          .chain()
          .focus()
          .setLink({ href: linkUrl })
          .run();
      } else {
        // If no text is selected, insert the URL as both text and link
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: linkUrl,
          })
          .setLink({ href: linkUrl })
          .run();
      }
    }
    setIsLinkModalOpen(false);
    setLinkUrl('');
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    console.log('Image upload triggered with file:', file);
    
    if (file && auth.currentUser) {
      console.log('User authenticated, proceeding with upload');
      try {
        const downloadURL = await uploadImage(file, auth.currentUser.uid);
        console.log('Image uploaded successfully, URL:', downloadURL);
        editor.chain().focus().setImage({ src: downloadURL }).run();
        console.log('Image inserted into editor');
      } catch (error) {
        console.error('Error uploading image:', error);
        // You might want to show an error message to the user here
      }
    } else {
      console.log('Upload cancelled - no file selected or user not authenticated', {
        fileExists: !!file,
        userAuthenticated: !!auth.currentUser
      });
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    
    if (file && auth.currentUser) {
      try {
        const downloadURL = await uploadFile(file, auth.currentUser.uid);
        
        // Determine file type and create appropriate attachment
        let type = 'file';
        if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else if (file.type.startsWith('image/')) type = 'image';
        else if (file.type === 'application/pdf') type = 'pdf';
        
        editor.chain().focus().setFileAttachment({ 
          filename: file.name,
          url: downloadURL,
          size: file.size,
          type: type,
          mimeType: file.type
        }).run();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Bold (Ctrl+B)"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('italic')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Italic (Ctrl+I)"
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <div className="relative group">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('heading')
                ? 'bg-blue-500 text-white'
                : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
            }`}
            title="Heading"
          >
            <FontAwesomeIcon icon={faHeading} />
          </button>
          <div 
            className="absolute hidden group-hover:block bg-white dark:bg-gray-800 rounded shadow-lg mt-1 py-1 min-w-[150px] z-10 transition-opacity duration-150"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="absolute w-full h-4 -top-4 bg-transparent"></div>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level }).run();
                }}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  editor.isActive('heading', { level })
                    ? 'bg-blue-500 text-white'
                    : `${theme === 'light' 
                        ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                }`}
              >
                Heading {level}
              </button>
            ))}
            <div className="absolute w-full h-4 -bottom-4 bg-transparent"></div>
          </div>
        </div>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Quote"
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Bullet List"
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Numbered List"
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Code Block"
        >
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('highlight')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Highlight"
        >
          <FontAwesomeIcon icon={faHighlighter} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50`}
          title="Undo"
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50`}
          title="Redo"
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <button
          onClick={addImage}
          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
          title="Add Image"
        >
          <FontAwesomeIcon icon={faImage} />
        </button>
        <button
          onClick={addFile}
          className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
          title="Attach File"
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('taskList')
              ? 'bg-blue-500 text-white'
              : `${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`
          }`}
          title="Task List (Ctrl+Shift+T)"
        >
          <FontAwesomeIcon icon={faSquareCheck} />
        </button>
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          title="Add Link (Ctrl+K)"
        >
          <FontAwesomeIcon icon={faLink} className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'} />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 my-auto mx-1" />
        <div className="relative">
          <button
            ref={exportButtonRef}
            onClick={() => setShowExportMenu(!showExportMenu)}
            className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-700`}
            title="Export Note"
          >
            <FontAwesomeIcon icon={faFileExport} />
          </button>
          
          {showExportMenu && createPortal(
            <div 
              ref={exportMenuRef}
              className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
              style={{
                top: exportButtonRef.current?.getBoundingClientRect().bottom + 5,
                left: exportButtonRef.current?.getBoundingClientRect().left,
                minWidth: '150px'
              }}
            >
              <button
                onClick={() => {
                  onExport('pdf');
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Export as PDF
              </button>
              <button
                onClick={() => {
                  onExport('markdown');
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                Export as Markdown
              </button>
            </div>,
            document.body
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          accept="video/*,audio/*,image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          className="hidden"
        />
      </div>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Insert Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkSubmit}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const FloatingLinkMenu = ({ editor }) => {
  const { theme } = useTheme();
  const [editMode, setEditMode] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (editMode && inputRef.current) {
      const url = editor.getAttributes('link').href;
      setLinkUrl(url);
      inputRef.current.focus();
    }
  }, [editMode, editor]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setEditMode(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      setEditMode(false);
    }
  };

  return (
    <BubbleMenu 
      editor={editor} 
      shouldShow={({ editor }) => editor.isActive('link')}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
      }}
      className={`flex items-center gap-1 p-1 rounded-lg shadow-lg border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-gray-800 border-gray-700'
      }`}
    >
      {editMode ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-64 px-2 py-1 text-sm rounded border ${
              theme === 'light'
                ? 'bg-white border-gray-200 text-gray-900'
                : 'bg-gray-700 border-gray-600 text-gray-100'
            }`}
            placeholder="Enter URL"
          />
          <button
            onClick={handleSaveEdit}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Save"
          >
            ✓
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Cancel"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <a
            href={editor.getAttributes('link').href}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-2 py-1 text-sm ${
              theme === 'light' ? 'text-blue-500' : 'text-blue-400'
            }`}
          >
            {editor.getAttributes('link').href}
          </a>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <button
            onClick={handleEditClick}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Edit link"
          >
            ✎
          </button>
          <button
            onClick={handleRemoveLink}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Remove link"
          >
            ✕
          </button>
        </div>
      )}
    </BubbleMenu>
  );
};

const TipTapEditor = ({ content, onChange, onExport }) => {
  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
          },
          marks: '',
          transformInputRule: true,
          transformPastedText: true,
          keymap: {
            'Mod-Alt-1': () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
            'Mod-Alt-2': () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            'Mod-Alt-3': () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: theme === 'light' 
              ? 'border-l-4 border-gray-300 pl-4 text-gray-700' 
              : 'border-l-4 border-gray-600 pl-4 text-gray-300',
          },
          transformInputRule: true,
          transformPastedText: true,
          keymap: {
            'Mod-Alt-q': () => editor?.chain().focus().toggleBlockquote().run(),
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-disc ml-4' : 'list-disc ml-4 text-gray-200',
          },
          transformInputRule: true,
          transformPastedText: true,
          keymap: {
            'Mod-Alt-l': () => editor?.chain().focus().toggleBulletList().run(),
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-decimal ml-4' : 'list-decimal ml-4 text-gray-200',
          },
          transformInputRule: true,
          transformPastedText: true,
          keymap: {
            'Mod-Alt-Shift-l': () => editor?.chain().focus().toggleOrderedList().run(),
          }
        },
        listItem: {
          HTMLAttributes: {
            class: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
          },
        },
        code: {
          HTMLAttributes: {
            class: theme === 'light'
              ? 'bg-gray-100 rounded px-1 font-mono text-sm text-gray-800'
              : 'bg-gray-800 rounded px-1 font-mono text-sm text-blue-300',
          },
          transformInputRule: true,
          transformPastedText: true,
          keymap: {
            'Mod-Alt-`': () => editor?.chain().focus().toggleCode().run(),
          }
        },
        codeBlock: false,
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-slate-100 dark:bg-slate-900 rounded-lg p-3 font-mono text-sm border dark:border-gray-700',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: theme === 'light'
            ? 'bg-yellow-200 text-gray-900 rounded px-1'
            : 'bg-yellow-900 text-gray-100 rounded px-1',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      ResizableImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
        uploadImage: async (file) => {
          if (auth.currentUser) {
            try {
              const downloadURL = await uploadImage(file, auth.currentUser.uid);
              return downloadURL;
            } catch (error) {
              console.error('Error uploading image:', error);
              return null;
            }
          }
          return null;
        },
      }),
      FileAttachment,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-1',
        },
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline',
          rel: 'noopener noreferrer nofollow',
        },
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      console.log('Editor content updated:', editor.getHTML());
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] ${styles.editor}`,
      },
      handleDrop: async (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files.length && auth.currentUser) {
          const file = event.dataTransfer.files[0];
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          
          if (isImage) {
            event.preventDefault();
            try {
              const downloadURL = await uploadImage(file, auth.currentUser.uid);
              if (downloadURL) {
                const { tr } = view.state;
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
                if (pos) {
                  view.dispatch(tr.insert(pos, editor.schema.nodes.image.create({ src: downloadURL })));
                }
              }
            } catch (error) {
              console.error('Error uploading dropped image:', error);
            }
            return true;
          }
          
          if (isVideo) {
            event.preventDefault();
            try {
              const downloadURL = await uploadFile(file, auth.currentUser.uid);
              if (downloadURL) {
                const { tr } = view.state;
                const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
                if (pos) {
                  editor.chain().focus().setFileAttachment({ 
                    filename: file.name,
                    url: downloadURL,
                    size: file.size,
                    type: 'video',
                    mimeType: file.type
                  }).run();
                }
              }
            } catch (error) {
              console.error('Error uploading dropped video:', error);
            }
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        // Handle pasted images from clipboard
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem && auth.currentUser) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          uploadImage(file, auth.currentUser.uid)
            .then(downloadURL => {
              if (downloadURL) {
                editor.chain().focus().setImage({ src: downloadURL }).run();
              }
            })
            .catch(error => {
              console.error('Error uploading pasted image:', error);
            });
          return true;
        }

        return false;
      },
    },
  });

  // Update editor content when prop changes
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      console.log('Content prop changed:', content);
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <div className={`border rounded-lg overflow-hidden ${
      theme === 'light'
        ? 'light bg-white border-gray-200'
        : 'dark bg-gray-800 border-gray-700'
    }`}>
      <MenuBar editor={editor} onExport={onExport} />
      <FloatingLinkMenu editor={editor} />
      <EditorContent 
        editor={editor} 
        className={`${
          theme === 'light'
            ? 'text-gray-800'
            : 'text-gray-100'
        }`}
      />
    </div>
  );
};

export default TipTapEditor; 