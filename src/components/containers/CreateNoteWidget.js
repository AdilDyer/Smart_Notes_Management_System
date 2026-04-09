"use client";

import React, { useState } from 'react';
import NoteForm from '../ui/NoteForm';
import { useNotes } from '@/context/NotesContext';

export default function CreateNoteWidget() {
  const { addNote } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = (noteData) => {
    addNote(noteData);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="note-creator-wrapper">
        <div 
          className="glass-panel note-creator" 
          style={{ padding: '16px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          onClick={() => setIsExpanded(true)}
        >
          Take a note...
        </div>
      </div>
    );
  }

  return (
    <div className="note-creator-wrapper">
      <div style={{ width: '100%', maxWidth: '600px' }}>
         <NoteForm 
           onSave={handleSave} 
           onCancel={() => setIsExpanded(false)} 
         />
      </div>
    </div>
  );
}
