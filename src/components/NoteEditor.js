import React, { useState, useEffect } from 'react';
import { BsCheckCircle, BsSave } from 'react-icons/bs';

function NoteEditor({ note, onUpdateNote }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
    setIsSaved(true);
    setHasChanges(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setHasChanges(true);
    setIsSaved(false);
    onUpdateNote({ ...note, title: newTitle });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setHasChanges(true);
    setIsSaved(false);
    onUpdateNote({ ...note, content: newContent });
  };

  const handleSave = () => {
    setIsSaving(true);
    const updatedNote = {
      ...note,
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    // 저장 시뮬레이션 (실제로는 이미 자동 저장되지만 사용자 피드백을 위해)
    setTimeout(() => {
      onUpdateNote(updatedNote);
      setIsSaving(false);
      setIsSaved(true);
      setHasChanges(false);
    }, 300);
  };

  return (
    <div className="h-full bg-white m-4 md:m-8 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between gap-4 mb-2">
          <input
            type="text"
            className="flex-1 text-2xl md:text-3xl font-bold bg-transparent border-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:rounded-lg px-2 py-1 transition-all"
            placeholder="제목을 입력하세요..."
            value={title}
            onChange={handleTitleChange}
          />
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSaved
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }`}
            title={isSaved ? '저장됨' : '저장하기'}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="hidden md:inline">저장 중...</span>
              </>
            ) : isSaved ? (
              <>
                <BsCheckCircle className="w-5 h-5" />
                <span className="hidden md:inline">저장됨</span>
              </>
            ) : (
              <>
                <BsSave className="w-5 h-5" />
                <span className="hidden md:inline">저장</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <textarea
          className="w-full h-full min-h-[300px] md:min-h-[400px] text-base leading-relaxed border-none outline-none resize-none bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:rounded-lg px-2 py-1 transition-all"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={handleContentChange}
        />
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-2">
        <span className="inline-block bg-gray-200 text-gray-600 text-xs md:text-sm px-3 py-1 rounded-full">
          마지막 수정: {new Date(note.updatedAt).toLocaleString('ko-KR')}
        </span>
        {hasChanges && !isSaved && (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs md:text-sm px-3 py-1 rounded-full animate-pulse">
            저장되지 않은 변경사항이 있습니다
          </span>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;

