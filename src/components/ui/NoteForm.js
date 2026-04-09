import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

export default function NoteForm({ onSave, initialData = null, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  // Simply store tags as a single comma-separated string for easy editing
  const [tagsString, setTagsString] = useState(initialData?.tags?.join(', ') || '');
  
  const contentRef = useRef(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Don't save if both title and content are empty
    if (!title.trim() && !content.trim()) return;
    
    // Convert the string like "work, study" into an array ["work", "study"]
    const tagsArray = tagsString
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag !== ''); // remove empty tags
      
    // Remove duplicates
    const uniqueTags = Array.from(new Set(tagsArray));
    
    onSave({ 
      title: title.trim(), 
      content: content.trim(), 
      tags: uniqueTags 
    });
    
    // Reset form for next note
    setTitle('');
    setContent('');
    setTagsString('');
  };

  return (
    <form className="glass-panel note-creator" onSubmit={handleSubmit}>
      <input
        type="text"
        className="glass-input creator-title-input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <textarea
        ref={contentRef}
        className="glass-input creator-content-input"
        placeholder="Take a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={1}
      />

      <div className="creator-actions">
        <input
          type="text"
          className="glass-input"
          style={{ width: '60%', padding: '8px 16px', fontSize: '0.875rem' }}
          placeholder="Tags (comma-separated, e.g. work, study)"
          value={tagsString}
          onChange={(e) => setTagsString(e.target.value)}
        />
        
        <div>
          {onCancel && (
            <button type="button" className="btn" onClick={onCancel} style={{ marginRight: '8px' }}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={!title.trim() && !content.trim()}>
            <Plus size={18} />
            <span>{initialData ? 'Save Note' : 'Add Note'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
