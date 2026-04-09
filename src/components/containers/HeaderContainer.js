import React from 'react';
import SearchBar from '../ui/SearchBar';
import { Layers } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HeaderContainer() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-title">
        <Layers size={28} color="var(--accent-color)" />
        <span>NoteHive</span>
      </div>
      <SearchBar />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', justifyContent: 'flex-end' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</span>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
