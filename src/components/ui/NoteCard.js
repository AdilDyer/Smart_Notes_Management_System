import React from 'react';
import { Pin, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onTogglePin, onDelete, onTagClick }) {
  const { id, title, content, tags, isPinned } = note;

  return (
    <div className="glass-panel note-card">
      <button 
        className={`btn-icon pin-btn ${isPinned ? 'pinned' : ''}`}
        onClick={(e) => { e.stopPropagation(); onTogglePin(id); }}
        title={isPinned ? "Unpin note" : "Pin note"}
      >
        <Pin size={20} fill={isPinned ? "currentColor" : "none"} />
      </button>

      {title && <h3 className="note-title">{title}</h3>}
      <p className="note-content">{content}</p>

      {tags && tags.length > 0 && (
        <div className="note-tags">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="tag-badge clickable"
              onClick={(e) => { e.stopPropagation(); onTagClick && onTagClick(tag); }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <button 
          className="btn-icon" 
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
          title="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
