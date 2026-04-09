"use client";

import React from 'react';
import HeaderContainer from '@/components/containers/HeaderContainer';
import Sidebar from '@/components/containers/Sidebar';
import CreateNoteWidget from '@/components/containers/CreateNoteWidget';
import NoteListBoard from '@/components/containers/NoteListBoard';

export default function Home() {
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
