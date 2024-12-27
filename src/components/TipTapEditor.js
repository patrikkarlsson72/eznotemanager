import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, faItalic, faCode, faListUl, 
  faListOl, faHighlighter, faQuoteLeft,
  faHeading, faUndo, faRedo
} from '@fortawesome/free-solid-svg-icons';
import styles from './TipTapEditor.module.css';

const MenuBar = ({ editor }) => {
  const { theme } = useTheme();
  
  if (!editor) {
    return null;
  }

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
        },
        bulletList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-disc ml-4' : 'list-disc ml-4 text-gray-200',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: theme === 'light' ? 'list-decimal ml-4' : 'list-decimal ml-4 text-gray-200',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: theme === 'light' ? 'text-gray-800' : 'text-gray-200',
          },
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: theme === 'light'
            ? 'bg-gray-100 rounded p-4 font-mono text-sm text-gray-800'
            : 'bg-gray-900 rounded p-4 font-mono text-sm text-blue-300 border border-gray-700',
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
        placeholder: 'Write something amazing...',
        emptyEditorClass: theme === 'light'
          ? 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before:opacity-50 before:pointer-events-none'
          : 'cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-500 before:opacity-50 before:pointer-events-none',
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