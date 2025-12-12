import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

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
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          className="editor-title"
          placeholder="제목을 입력하세요..."
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="editor-body">
        <textarea
          className="editor-content"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="editor-footer">
        <span className="editor-info">
          마지막 수정: {new Date(note.updatedAt).toLocaleString('ko-KR')}
        </span>
      </div>
    </div>
  );
}

export default NoteEditor;

