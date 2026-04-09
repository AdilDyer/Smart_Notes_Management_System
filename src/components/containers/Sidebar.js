"use client";

import React from 'react';
import { Hash, List } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useFilter } from '@/context/FilterContext';

export default function Sidebar() {
  const { allTags } = useNotes();
  const { selectedTags, toggleTagFilter, clearFilters, searchQuery } = useFilter();

  return (
    <aside className="sidebar">
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          className={`btn ${selectedTags.length === 0 && !searchQuery ? 'btn-primary' : ''}`}
          style={{ width: '100%', justifyContent: 'flex-start', background: selectedTags.length === 0 && !searchQuery ? 'var(--accent-color)' : 'transparent', color: selectedTags.length === 0 && !searchQuery ? 'white' : 'inherit' }}
          onClick={clearFilters}
        >
          <List size={18} />
          All Notes
        </button>
      </div>
      
      <div>
        <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '16px', paddingLeft: '8px' }}>
          Tags
        </h3>
        {allTags.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', paddingLeft: '8px' }}>No tags yet</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allTags.map(tag => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  className={`btn ${isActive ? 'btn-primary' : ''}`}
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start', 
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? 'white' : 'inherit'
                  }}
                  onClick={() => toggleTagFilter(tag)}
                >
                  <Hash size={18} />
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
