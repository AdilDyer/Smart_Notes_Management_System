"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isLoaded: authLoaded } = useAuth();

  const fetchNotes = React.useCallback(async () => {
    if (!user) {
      setNotes([]);
      setIsLoaded(true);
      return;
    }

    try {
      const response = await fetch("/api/notes", { cache: "no-store" });
      const data = await response.json();
      if (response.ok) {
        setNotes(data.notes || []);
      } else {
        setNotes([]);
      }
    } catch {
      setNotes([]);
    } finally {
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoaded) return;
    setIsLoaded(false);
    fetchNotes();
  }, [authLoaded, fetchNotes]);

  const addNote = async (note) => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to create note");
    }
    setNotes((prevNotes) => [data.note, ...prevNotes]);
  };

  const updateNote = async (id, updatedFields) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to update note");
    }
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? data.note : note))
    );
  };

  const deleteNote = async (id) => {
    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to delete note");
    }
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const togglePin = async (id) => {
    const target = notes.find((note) => note.id === id);
    if (!target) return;
    await updateNote(id, { isPinned: !target.isPinned });
  };

  const runAiEnhancement = async (id, mode) => {
    const target = notes.find((note) => note.id === id);
    if (!target?.content?.trim()) {
      throw new Error("Note content is empty");
    }

    const aiResponse = await fetch("/api/ai/notes/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: target.content, mode }),
    });
    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      throw new Error(aiData.error || "AI enhancement failed");
    }

    if (mode === "summary") {
      await updateNote(id, { aiSummary: aiData.output });
    } else {
      await updateNote(id, {
        aiEnhancedText: aiData.output,
        content: aiData.output,
      });
    }
  };

  const runAiOnText = async (content, mode) => {
    if (!content?.trim()) {
      throw new Error("Note content is empty");
    }

    const aiResponse = await fetch("/api/ai/notes/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, mode }),
    });
    const aiData = await aiResponse.json();
    if (!aiResponse.ok) {
      throw new Error(aiData.error || "AI enhancement failed");
    }

    return aiData.output;
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
        runAiEnhancement,
        runAiOnText,
        refetchNotes: fetchNotes,
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
