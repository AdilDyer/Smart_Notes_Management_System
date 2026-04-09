"use client";

import React, { useState } from 'react';
import NoteForm from '../ui/NoteForm';
import { useNotes } from '@/context/NotesContext';

export default function CreateNoteWidget() {
  const { addNote, runAiOnText } = useNotes();
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (noteData) => {
    setError("");
    try {
      await addNote(noteData);
      setIsExpanded(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save note");
    }
  };

  const handleAiDraft = async (content, mode) => {
    return runAiOnText(content, mode);
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
         {error && <p style={{ color: "var(--danger-color)", marginBottom: "10px" }}>{error}</p>}
         <NoteForm 
           onSave={handleSave} 
           onAiDraft={handleAiDraft}
           onCancel={() => setIsExpanded(false)} 
         />
      </div>
    </div>
  );
}
