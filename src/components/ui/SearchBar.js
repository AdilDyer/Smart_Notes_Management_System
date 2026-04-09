import React from 'react';
import { Search, X } from 'lucide-react';
import { useFilter } from '@/context/FilterContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilter();

  return (
    <div className="search-container">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="glass-input search-input"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button 
          className="btn-icon" 
          onClick={() => setSearchQuery('')}
          style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
