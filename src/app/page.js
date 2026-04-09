"use client";

import React from 'react';
import HeaderContainer from '@/components/containers/HeaderContainer';
import Sidebar from '@/components/containers/Sidebar';
import CreateNoteWidget from '@/components/containers/CreateNoteWidget';
import NoteListBoard from '@/components/containers/NoteListBoard';
import AuthPanel from '@/components/ui/AuthPanel';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  if (!user) {
    return <AuthPanel />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <HeaderContainer />
        <CreateNoteWidget />
        <NoteListBoard />
      </main>
    </div>
  );
}
