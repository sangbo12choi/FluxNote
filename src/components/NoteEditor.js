import React, { useState, useEffect } from 'react';

function NoteEditor({ note, onUpdateNote }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdateNote({ ...note, title: newTitle });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdateNote({ ...note, content: newContent });
  };

  return (
    <div className="h-full bg-white m-4 md:m-8 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
        <input
          type="text"
          className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:rounded-lg px-2 py-1 transition-all"
          placeholder="제목을 입력하세요..."
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <textarea
          className="w-full h-full min-h-[300px] md:min-h-[400px] text-base leading-relaxed border-none outline-none resize-none bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:rounded-lg px-2 py-1 transition-all"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <span className="inline-block bg-gray-200 text-gray-600 text-xs md:text-sm px-3 py-1 rounded-full">
          마지막 수정: {new Date(note.updatedAt).toLocaleString('ko-KR')}
        </span>
      </div>
    </div>
  );
}

export default NoteEditor;

