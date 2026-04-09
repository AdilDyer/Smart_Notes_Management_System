import React from 'react';
import SearchBar from '../ui/SearchBar';
import { Layers } from 'lucide-react';

export default function HeaderContainer() {
  return (
    <header className="app-header">
      <div className="app-title">
        <Layers size={28} color="var(--accent-color)" />
        <span>NoteHive</span>
      </div>
      <SearchBar />
      <div style={{ width: '120px' }}></div> {/* Spacer to maintain center alignment if needed */}
    </header>
  );
}
