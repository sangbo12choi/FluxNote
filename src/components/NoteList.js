import React from 'react';
import './NoteList.css';

function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  const getPreview = (content) => {
    if (!content) return '내용 없음';
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  };

  return (
    <div className="note-list">
      {notes.length === 0 ? (
        <div className="empty-list">
          <p>노트가 없습니다</p>
        </div>
      ) : (
        <div className="note-items">
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNote && selectedNote.id === note.id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-item-header">
                <h3 className="note-item-title">
                  {note.title || '제목 없음'}
                </h3>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
              <p className="note-item-preview">{getPreview(note.content)}</p>
              <span className="note-item-date">{formatDate(note.updatedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;

