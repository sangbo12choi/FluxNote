import React, { useState, useEffect } from 'react';
import './App.css';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 로컬 스토리지에서 노트 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem('fluxnote-notes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
  }, []);

  // 노트가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('fluxnote-notes', JSON.stringify(notes));
  }, [notes]);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 FluxNote</h1>
        <button className="btn-create" onClick={handleCreateNote}>
          + 새 노트
        </button>
      </header>
      
      <div className="app-container">
        <aside className="sidebar">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            onDeleteNote={handleDeleteNote}
          />
        </aside>
        
        <main className="main-content">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdateNote={handleUpdateNote}
            />
          ) : (
            <div className="empty-state">
              <p>노트를 선택하거나 새 노트를 만들어보세요!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

