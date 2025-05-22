import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <div className="tiptap-menubar" onClick={e => e.stopPropagation()}>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleBold().run())}
        className={`p-1 rounded ${editor.isActive('bold') ? 'is-active' : ''}`}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleItalic().run())}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleUnderline().run())}
        className={`p-1 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleStrike().run())}
        className={`p-1 rounded ${editor.isActive('strike') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Strike"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z" />
        </svg>
      </button>
      <div className="border-l border-gray-300 mx-2"></div>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Heading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M17 11V4h2v17h-2v-8H7v8H5V4h2v7z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleBulletList().run())}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().toggleOrderedList().run())}
        className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Ordered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zm2 8h13v2H7v-2zm-2-1v3h1v1H3v-1h1v-1H3v-2h2zm2 8h13v2H7v-2zm-2-1v3h1v1H3v-1h1v-1H3v-2h2z" />
        </svg>
      </button>
      <div className="border-l border-gray-300 mx-2"></div>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().setTextAlign('left').run())}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Align Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().setTextAlign('center').run())}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Align Center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z" />
        </svg>
      </button>
      <button
        onClick={(e) => handleClick(e, () => editor.chain().focus().setTextAlign('right').run())}
        className={`p-1 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        title="Align Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z" />
        </svg>
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2]
        }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 h-[150px] overflow-y-auto focus:outline-none no-scrollbar',
      },
      handleDOMEvents: {
        focus: (view, event) => {
          // Prevent scrolling on focus
          event.preventDefault();
          return false;
        }
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  }); return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-white border-b border-gray-200">
        <MenuBar editor={editor} />
      </div>
      <div className="relative" style={{ height: '150px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
