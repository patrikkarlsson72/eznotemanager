import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Node } from '@tiptap/core';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, faItalic, faCode, faListUl, 
  faListOl, faHighlighter, faQuoteLeft,
  faHeading, faUndo, faRedo, faImage,
  faPaperclip, faSquareCheck
} from '@fortawesome/free-solid-svg-icons';
import styles from './TipTapEditor.module.css';
import MarkdownIt from 'markdown-it';
import { uploadImage, uploadFile } from '../firebase/storage';
import { auth } from '../firebase';

const md = new MarkdownIt();

// Custom File Attachment Extension
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
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="file-attachment"]',
    }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', 
      { 
        'data-type': 'file-attachment',
        ...HTMLAttributes,
        class: 'flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 my-2'
      },
      ['span', { class: 'text-lg' }, '📎'],
      ['div', { class: 'flex flex-col' },
        ['span', { class: 'text-sm font-medium filename' }, node.attrs.filename || ''],
        ['a', 
          { 
            href: node.attrs.url || '#',
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'
          }, 
          'Download'
        ]
      ]
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'file-attachment');
      dom.className = 'flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700 my-2';

      const icon = document.createElement('span');
      icon.className = 'text-lg';
      icon.textContent = '📎';

      const container = document.createElement('div');
      container.className = 'flex flex-col';

      const filename = document.createElement('span');
      filename.className = 'text-sm font-medium filename';
      filename.textContent = node.attrs.filename || '';

      const link = document.createElement('a');
      link.href = node.attrs.url || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300';
      link.textContent = 'Download';

      container.append(filename, link);
      dom.append(icon, container);

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== node.type.name) return false;
          
          filename.textContent = updatedNode.attrs.filename || '';
          link.href = updatedNode.attrs.url || '#';
          
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

const MenuBar = ({ editor }) => {
  const { theme } = useTheme();
  const imageInputRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  
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
        editor.chain().focus().setFileAttachment({ 
          filename: file.name,
          url: downloadURL,
          size: file.size
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
        className="hidden"
      />
    </div>
  );
};

const TipTapEditor = ({ content, onChange }) => {
  const { theme } = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
          },
          // Enable Markdown-style headings
          marks: '',
          transformInputRule: true,
          transformPastedText: true,
          // Add keyboard shortcuts for headings
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
          // Enable Markdown-style blockquotes
          transformInputRule: true,
          transformPastedText: true,
          // Add keyboard shortcut for blockquote
          keymap: {
            'Mod-Alt-q': () => editor?.chain().focus().toggleBlockquote().run(),
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-disc ml-4' : 'list-disc ml-4 text-gray-200',
          },
          // Enable Markdown-style bullet lists
          transformInputRule: true,
          transformPastedText: true,
          // Add keyboard shortcut for bullet list
          keymap: {
            'Mod-Alt-l': () => editor?.chain().focus().toggleBulletList().run(),
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-decimal ml-4' : 'list-decimal ml-4 text-gray-200',
          },
          // Enable Markdown-style ordered lists
          transformInputRule: true,
          transformPastedText: true,
          // Add keyboard shortcut for ordered list
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
          // Enable Markdown-style inline code
          transformInputRule: true,
          transformPastedText: true,
          // Add keyboard shortcut for inline code
          keymap: {
            'Mod-Alt-`': () => editor?.chain().focus().toggleCode().run(),
          }
        },
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
      CodeBlock.configure({
        HTMLAttributes: {
          class: theme === 'light'
            ? 'bg-gray-100 rounded p-4 font-mono text-sm text-gray-800'
            : 'bg-gray-900 rounded p-4 font-mono text-sm text-blue-300 border border-gray-700',
        },
        // Add keyboard shortcut for code block
        keymap: {
          'Mod-Alt-Shift-`': () => editor?.chain().focus().toggleCodeBlock().run(),
        }
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: theme === 'light'
            ? 'bg-yellow-200 text-gray-900 rounded px-1'
            : 'bg-yellow-900 text-gray-100 rounded px-1',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
        emptyEditorClass: theme === 'light'
          ? 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:opacity-50 before:pointer-events-none'
          : 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-500 before:opacity-50 before:pointer-events-none',
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
        }
        return false;
      },
      handlePaste: async (view, event, slice) => {
        // Handle pasted images from clipboard
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem && auth.currentUser) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          try {
            const downloadURL = await uploadImage(file, auth.currentUser.uid);
            if (downloadURL) {
              editor.chain().focus().setImage({ src: downloadURL }).run();
              return true;
            }
          } catch (error) {
            console.error('Error uploading pasted image:', error);
          }
          return true;
        }

        // Handle Markdown text paste (existing code)
        const text = event.clipboardData?.getData('text/plain');
        if (!text) return false;

        const hasMarkdownSyntax = /[#*_`\[\]\(\)\n\-\+]/.test(text);
        if (!hasMarkdownSyntax) return false;

        try {
          const html = md.render(text);
          if (html) {
            event.preventDefault();
            editor?.commands.insertContent(html);
            return true;
          }
        } catch (error) {
          console.error('Error parsing Markdown:', error);
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
      <MenuBar editor={editor} />
      <div className={`p-4 ${styles.editor} ${
        theme === 'light'
          ? 'prose'
          : 'prose prose-invert'
      } max-w-none`}>
        <EditorContent 
          editor={editor} 
          className={`${
            theme === 'light'
              ? 'text-gray-800'
              : 'text-gray-100'
          }`}
        />
      </div>
    </div>
  );
};

export default TipTapEditor; 