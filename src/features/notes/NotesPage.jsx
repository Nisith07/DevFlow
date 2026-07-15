import { useState } from 'react'
import { Plus, Search, FileText, X } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import NoteCard from './components/NoteCard'
import NoteEditor from './components/NoteEditor'
import { useNotes } from './hooks/useNotes'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

export default function NotesPage() {
  const [search,      setSearch]      = useState('')
  const [activeNote,  setActiveNote]  = useState(null)
  const [isCreating,  setIsCreating]  = useState(false)

  const { notes, isLoading, createNote, updateNote, deleteNote, togglePin } = useNotes(
    search ? { search } : {}
  )

  // ── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const fresh = await createNote({ title: 'Untitled Note', body: '' })
      setActiveNote(fresh)
    } catch (err) {
      alert(err.message || 'Failed to create note.')
    } finally {
      setIsCreating(false)
    }
  }

  // ── Update (called by NoteEditor's autosave) ────────────────────────────────
  const handleUpdate = async (id, updates) => {
    const updated = await updateNote({ id, ...updates })
    // Keep activeNote in sync so title/body reflect saves from other tabs
    setActiveNote((prev) => (prev?.id === id ? { ...prev, ...updated } : prev))
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this note?')) return
    try {
      await deleteNote(id)
      if (activeNote?.id === id) setActiveNote(null)
    } catch (err) {
      alert(err.message || 'Failed to delete note.')
    }
  }

  // ── Pin ─────────────────────────────────────────────────────────────────────
  const handleTogglePin = async (id) => {
    try {
      const updated = await togglePin(id)
      if (activeNote?.id === id) setActiveNote((prev) => ({ ...prev, isPinned: updated.isPinned }))
    } catch (err) {
      alert(err.message || 'Failed to update pin.')
    }
  }

  // ── Select ──────────────────────────────────────────────────────────────────
  const handleSelect = (note) => {
    setActiveNote(note)
  }

  const pinnedNotes  = notes.filter((n) => n.isPinned)
  const regularNotes = notes.filter((n) => !n.isPinned)

  return (
    <div
      className="view-enter"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        height: '100%',
      }}
    >
      <div style={{ paddingBottom: 20 }}>
        <PageHeader
          title="Notes"
          subtitle="Keep your thoughts, snippets, and research organized."
          action={
            <button
              className="app-btn primary"
              onClick={handleCreate}
              disabled={isCreating}
            >
              <Plus size={16} />
              <span>{isCreating ? 'Creating…' : 'New Note'}</span>
            </button>
          }
        />
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 0,
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--color-app-border)',
          borderRadius: 12,
          overflow: 'hidden',
          background: 'var(--color-app-bg)',
        }}
      >
        {/* ── Left: Note list sidebar ──────────────────────────────────────── */}
        <div
          style={{
            borderRight: '1px solid var(--color-app-border)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderBottom: '1px solid var(--color-app-border)',
              flexShrink: 0,
            }}
          >
            <Search size={14} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                color: 'var(--color-app-text)',
              }}
            />
            {search && (
              <button
                className="df-sugg-dismiss"
                onClick={() => setSearch('')}
                style={{ padding: 2 }}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Note list */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px 6px',
            }}
          >
            {isLoading ? (
              <LoadingSpinner size={32} />
            ) : notes.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--color-app-faint)', margin: 0 }}>
                  {search ? 'No notes match your search.' : 'No notes yet. Click "New Note" to start.'}
                </p>
              </div>
            ) : (
              <>
                {/* Pinned section */}
                {pinnedNotes.length > 0 && (
                  <>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-app-faint)',
                        padding: '4px 8px 2px',
                        margin: 0,
                      }}
                    >
                      📌 Pinned
                    </p>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        isActive={activeNote?.id === note.id}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                      />
                    ))}
                    <div
                      style={{
                        height: 1,
                        background: 'var(--color-app-border)',
                        margin: '6px 8px',
                      }}
                    />
                  </>
                )}

                {/* Regular notes */}
                {regularNotes.length > 0 && (
                  <>
                    {pinnedNotes.length > 0 && (
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--color-app-faint)',
                          padding: '4px 8px 2px',
                          margin: 0,
                        }}
                      >
                        Notes
                      </p>
                    )}
                    {regularNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        isActive={activeNote?.id === note.id}
                        onSelect={handleSelect}
                        onDelete={handleDelete}
                        onTogglePin={handleTogglePin}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right: Editor pane ───────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          {activeNote ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              onUpdate={handleUpdate}
              onTogglePin={handleTogglePin}
            />
          ) : (
            <EmptyState
              icon={<FileText size={48} />}
              title="Select a Note"
              description='Pick a note from the list, or click "New Note" to create one.'
            />
          )}
        </div>
      </div>
    </div>
  )
}
