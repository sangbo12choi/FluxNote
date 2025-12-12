import React from 'react';
import { BsTrash } from 'react-icons/bs';

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
    <div className="flex-1 overflow-y-auto">
      {notes.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">노트가 없습니다</p>
        </div>
      ) : (
        <div className="p-2">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200 border-l-4 ${
                selectedNote && selectedNote.id === note.id
                  ? 'bg-indigo-50 border-indigo-500 shadow-md'
                  : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:translate-x-1'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 flex-1 truncate">
                  {note.title || '제목 없음'}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="text-red-500 hover:text-red-700 opacity-60 hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                  title="삭제"
                >
                  <BsTrash className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {getPreview(note.content)}
              </p>
              <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                {formatDate(note.updatedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;

