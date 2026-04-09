import React from 'react';
import { Pin, Trash2 } from 'lucide-react';

export default function NoteCard({ note, onTogglePin, onDelete, onEnhance, isAiPending, onTagClick }) {
  const { id, title, content, tags, isPinned, aiSummary } = note;

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
      {aiSummary && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>AI Summary</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
        </div>
      )}

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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn"
            onClick={(e) => { e.stopPropagation(); onEnhance && onEnhance(id, 'summary'); }}
            disabled={isAiPending}
          >
            Summarize
          </button>
          <button
            className="btn"
            onClick={(e) => { e.stopPropagation(); onEnhance && onEnhance(id, 'enhance'); }}
            disabled={isAiPending}
          >
            Enhance
          </button>
        </div>
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
