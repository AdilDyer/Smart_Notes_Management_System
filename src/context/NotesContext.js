"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notehive-notes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse notes from local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save notes to local storage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("notehive-notes", JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isPinned: false,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const updateNote = (id, updatedFields) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updatedFields } : note
      )
    );
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  // Helper to get all unique tags currently used
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || [])));

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoaded,
        allTags,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
