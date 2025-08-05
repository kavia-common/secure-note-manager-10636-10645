import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
// Import design tokens for custom props/class reference
import './design-tokens.css';

/**
 * MaskedText component.
 * Replaces sensitive words (marked in [MASK]...[/MASK]) with grayed blocks.
 * @param {string} text
 * @param {boolean} showMasked
 */
function MaskedText({ text, showMasked }) {
  // PUBLIC_INTERFACE
  /** Returns rendered note text, masking text in [MASK][/MASK] blocks. */
  if (!text) return null;
  const MASK_START = '[MASK]';
  const MASK_END = '[/MASK]';
  let res = [];
  let idx = 0;
  let i = 0;
  while (i < text.length) {
    let nextStart = text.indexOf(MASK_START, i);
    if (nextStart === -1) {
      res.push(<span key={idx++}>{text.slice(i)}</span>);
      break;
    }
    if (nextStart > i) res.push(<span key={idx++}>{text.slice(i, nextStart)}</span>);
    let end = text.indexOf(MASK_END, nextStart);
    if (end === -1) end = text.length;
    if (showMasked) {
      res.push(<span key={idx++} className="masked-word">{text.slice(nextStart + MASK_START.length, end)}</span>);
    } else {
      res.push(<span key={idx++} className="masked-block">••••••</span>);
    }
    i = end + MASK_END.length;
  }
  return <>{res}</>;
}

/** Editor Modal/UI for editing or creating a note */
function NoteModal({ open, onClose, onSave, note, isEdit, onDelete, onMaskToggle }) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [showMasked, setShowMasked] = useState(true);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setShowMasked(note.showMasked ?? true);
    } else {
      setTitle('');
      setContent('');
      setShowMasked(true);
    }
  }, [note, open]);

  if (!open) return null;
  // Implement simple highlight for masking: user will wrap text with [MASK][/MASK] for demo
  // Real implementation would allow UI to select and wrap, but for demo we keep it simple

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 style={{ fontFamily: "var(--font-nunito)" }}>{isEdit ? "Edit Note" : "New Note"}</h2>
        <input
          className="modal-title"
          style={{ fontFamily: "var(--font-nunito)", backgroundColor: "rgba(231, 225, 177, 1)" }}
          placeholder="Title"
          type="text"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="modal-content"
          style={{ fontFamily: "var(--font-nunito)" }}
          placeholder="Write your note... use [MASK]sensitive[/MASK] to mark sensitive"
          rows={7}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="modal-toolbar">
          <button
            className={showMasked ? "modal-btn active" : "modal-btn"}
            onClick={() => setShowMasked(true)}
            title="Show masked"
            style={{ minWidth: 80 }}
          >Show</button>
          <button
            className={!showMasked ? "modal-btn active" : "modal-btn"}
            onClick={() => setShowMasked(false)}
            title="Show hidden"
            style={{ minWidth: 80 }}
          >Mask</button>
          <button className="modal-btn modal-primary"
            onClick={() => {
              onSave({ ...note, title, content, showMasked });
              onClose();
            }}
            disabled={title.trim().length === 0}
          >Save</button>
          {isEdit && (
            <button
              className="modal-btn modal-delete"
              onClick={() => {
                if (window.confirm('Delete this note?')) {
                  onDelete(note.id);
                  onClose();
                }
              }}
            >
              Delete
            </button>
          )}
          <button className="modal-btn" onClick={onClose} style={{ marginLeft: 'auto' }}>Cancel</button>
        </div>
        <div className="modal-preview">
          <div className="preview-label">Preview:</div>
          <MaskedText text={content} showMasked={showMasked} />
        </div>
      </div>
    </div>
  );
}

/** Sidebar navigation and new note button */
function Sidebar({ onNewNote }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span role="img" aria-label="notes" className="sidebar-logo">📝</span>
        <span className="sidebar-title">Notes</span>
        <button className="sidebar-add" onClick={onNewNote} title="Add">
          <span className="plus-icon">＋</span>
        </button>
      </div>
      <div className="sidebar-info">Mask your sensitive notes safely.</div>
    </aside>
  );
}

/** Individual Note List Card */
function NoteCard({ note, onClick, onDelete, onEdit, onMaskToggle }) {
  return (
    <div className="note-card" onClick={onClick}>
      <div className="note-card-content">
        <div style={{
          fontFamily: "var(--typo-13-family)",
          fontWeight: "var(--typo-13-weight)",
          fontSize: "var(--typo-13-size)",
          color: "var(--color-3b3b3b)"
        }}>
          {note.title}
        </div>
        <div style={{ marginTop: 6, fontFamily: "var(--font-roboto)", color: "var(--color-606060)", fontSize: 15, minHeight: 12 }}>
          <MaskedText text={note.content} showMasked={note.showMasked ?? true} />
        </div>
      </div>
      <div className="note-card-actions">
        <button className="note-action-btn" onClick={e => { e.stopPropagation(); onEdit(note); }} title="Edit">✏️</button>
        <button className="note-action-btn" onClick={e => { e.stopPropagation(); onDelete(note.id); }} title="Delete">🗑️</button>
        <button className="note-action-btn"
          onClick={e => {
            e.stopPropagation();
            onMaskToggle(note.id, !(note.showMasked ?? true));
          }}
          title={note.showMasked ? "Mask" : "Unmask"}>
          {note.showMasked ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );
}

/**
 * Main App container for notes UI.
 * All notes are kept in local state for demo (in-memory).
 */
function App() {
  const [notes, setNotes] = useState(() => {
    const v = window.localStorage.getItem('notes-list');
    return v ? JSON.parse(v) : [];
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('notes-list', JSON.stringify(notes));
  }, [notes]);

  // PUBLIC_INTERFACE
  /** Create a new note, or save edit. */
  const handleSaveNote = (note) => {
    if (note.id) {
      // Edit
      setNotes(notes.map(n => n.id === note.id ? { ...note } : n));
    } else {
      setNotes([
        ...notes,
        { ...note, id: Date.now(), showMasked: true }
      ]);
    }
  };
  // PUBLIC_INTERFACE
  /** Delete note by ID. */
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  // PUBLIC_INTERFACE
  /** Toggle mask/unmask for a note by ID. */
  const handleMaskToggle = (id, showMasked) => {
    setNotes(notes.map(n => n.id === id ? { ...n, showMasked } : n));
  };
  // PUBLIC_INTERFACE
  /** Open note in editor for viewing/editing. */
  const handleEditNote = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };
  // PUBLIC_INTERFACE
  /** Start new note. */
  const handleNewNote = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  return (
    <div className="root-layout">
      <Sidebar onNewNote={handleNewNote} />
      <main className="main-notes">
        <div className="notes-list">
          {notes.length === 0 && (
            <div className="notes-empty">No notes yet. Click ＋ to add one.</div>
          )}
          {notes.map(note =>
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => handleEditNote(note)}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
              onMaskToggle={handleMaskToggle}
            />
          )}
        </div>
      </main>
      <NoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        isEdit={!!editingNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}

export default App;
