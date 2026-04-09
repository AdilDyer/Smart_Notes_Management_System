"use client";

import React, { useMemo } from 'react';
import { useNotes } from '@/context/NotesContext';
import { useFilter } from '@/context/FilterContext';
import NoteCard from '../ui/NoteCard';

export default function NoteListBoard() {
  const { notes, togglePin, deleteNote, isLoaded } = useNotes();
  const { searchQuery, selectedTags, toggleTagFilter } = useFilter();

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = searchQuery === '' || 
        (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => note.tags && note.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [notes, searchQuery, selectedTags]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.isPinned);

  if (!isLoaded) {
    return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading notes...</div>;
  }

  if (filteredNotes.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No notes found</h3>
        <p>Try creating a note or adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="note-board">
      {pinnedNotes.length > 0 && (
        <section>
          <h2 className="board-section-title">Pinned</h2>
          <div className="notes-grid">
            {pinnedNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onTogglePin={togglePin} 
                onDelete={deleteNote}
                onTagClick={toggleTagFilter}
              />
            ))}
          </div>
        </section>
      )}

      {unpinnedNotes.length > 0 && (
        <section>
          <h2 className="board-section-title">{pinnedNotes.length > 0 ? 'Others' : 'Notes'}</h2>
          <div className="notes-grid">
            {unpinnedNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onTogglePin={togglePin} 
                onDelete={deleteNote}
                onTagClick={toggleTagFilter}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
