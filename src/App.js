import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const { user, loading, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  // 로컬 스토리지에서 노트 불러오기 (사용자별)
  useEffect(() => {
    if (user) {
      const savedNotes = localStorage.getItem(`fluxnote-notes-${user.id}`);
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (error) {
          console.error('Failed to load notes:', error);
        }
      } else {
        setNotes([]);
      }
    }
  }, [user]);

  // 노트가 변경될 때마다 로컬 스토리지에 저장 (사용자별)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`fluxnote-notes-${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  // 새 노트 생성
  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: '',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  // 노트 업데이트
  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    ));
    setSelectedNote(updatedNote);
  };

  // 노트 삭제
  const handleDeleteNote = (noteId) => {
    if (window.confirm('정말 이 노트를 삭제하시겠습니까?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null);
      }
    }
  };

  // 노트 선택
  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  // 검색 필터링
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-xl font-semibold flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          로딩 중...
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  // 로그인한 경우 - 메모 앱 표시
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <h1 className="text-2xl font-bold">FluxNote</h1>
            </div>
            <div className="hidden md:block text-white/90">
              {user.name}님 환영합니다!
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateNote}
                className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-indigo-50 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                + 새 노트
              </button>
              <button
                onClick={logout}
                className="bg-white/20 border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>
        
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdateNote={handleUpdateNote}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-xl">노트를 선택하거나 새 노트를 만들어보세요!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
