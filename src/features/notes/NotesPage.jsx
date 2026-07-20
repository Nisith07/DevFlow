import { useState } from 'react'
import { Plus, Search, FileText, X, Star, Folder, ClipboardList, CheckSquare } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import NoteCard from './components/NoteCard'
import NoteEditor from './components/NoteEditor'
import { useNotes } from './hooks/useNotes'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

export default function NotesPage() {
  const [search, setSearch] = useState('')
  const [activeNote, setActiveNote] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  // Filters State
  const [filterFavOnly, setFilterFavOnly] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('') // '' means all

  // Build backend filters
  const backendFilters = {}
  if (search.trim()) backendFilters.search = search.trim()
  if (filterFavOnly) backendFilters.favorite = 'true'
  if (selectedFolder) backendFilters.folder = selectedFolder

  const { notes, isLoading, createNote, updateNote, deleteNote, togglePin } = useNotes(backendFilters)

  // We query all user notes unfiltered to extract the complete list of unique folders!
  const { notes: allNotesUnfiltered = [] } = useNotes({})
  const uniqueFolders = Array.from(
    new Set(allNotesUnfiltered.map(n => n.folder).filter(Boolean))
  ).sort()

  const handleCreate = async () => {
    setIsCreating(true)
    try {
      const fresh = await createNote({ 
        title: 'Untitled Note', 
        body: '',
        folder: selectedFolder || '',
        isFavorite: filterFavOnly
      })
      setActiveNote(fresh)
    } catch (err) {
      alert(err.message || 'Failed to create note.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdate = async (id, updates) => {
    const updated = await updateNote({ id, ...updates })
    setActiveNote((prev) => (prev?.id === id ? { ...prev, ...updated } : prev))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this note?')) return
    try {
      await deleteNote(id)
      if (activeNote?.id === id) setActiveNote(null)
    } catch (err) {
      alert(err.message || 'Failed to delete note.')
    }
  }

  const handleTogglePin = async (id) => {
    try {
      const updated = await togglePin(id)
      if (activeNote?.id === id) setActiveNote((prev) => ({ ...prev, isPinned: updated.isPinned }))
    } catch (err) {
      alert(err.message || 'Failed to update pin.')
    }
  }

  const handleSelect = (note) => {
    setActiveNote(note)
  }

  const pinnedNotes = notes.filter((n) => n.isPinned)
  const regularNotes = notes.filter((n) => !n.isPinned)

  const handleSelectFolderFilter = (folderName) => {
    setSelectedFolder(folderName)
    setFilterFavOnly(false)
  }

  const handleSelectFavFilter = () => {
    setFilterFavOnly(true)
    setSelectedFolder('')
  }

  const handleClearFilters = () => {
    setFilterFavOnly(false)
    setSelectedFolder('')
    setSearch('')
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ paddingBottom: 16 }}>
        <PageHeader
          title="Notion Lite Notes"
          subtitle="Document project specifications, code notes, and research in live Markdown."
          action={
            <button className="app-btn primary" onClick={handleCreate} disabled={isCreating}>
              <Plus size={16} />
              <span>{isCreating ? 'Creating…' : 'New Note'}</span>
            </button>
          }
        />
      </div>

      {/* Main Grid Panels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '290px 1fr',
          gap: 0,
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--color-app-border)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--color-app-bg)',
        }}
      >
        {/* LEFT SIDEBAR: Folders list, stars list, search, and notes */}
        <div style={{ borderRight: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          
          {/* Main Quick Filters */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              onClick={handleClearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: !filterFavOnly && !selectedFolder ? '700' : '500',
                background: !filterFavOnly && !selectedFolder ? 'var(--color-app-surface)' : 'transparent',
                color: !filterFavOnly && !selectedFolder ? '#fff' : 'var(--color-app-muted)'
              }}
            >
              <ClipboardList size={13} /> <span>All Notes</span>
            </button>
            <button
              onClick={handleSelectFavFilter}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: filterFavOnly ? '700' : '500',
                background: filterFavOnly ? 'var(--color-app-surface)' : 'transparent',
                color: filterFavOnly ? 'var(--color-amber)' : 'var(--color-app-muted)'
              }}
            >
              <Star size={13} fill={filterFavOnly ? 'var(--color-amber)' : 'none'} /> <span>Favorites</span>
            </button>
          </div>

          {/* Folders category filters */}
          {uniqueFolders.length > 0 && (
            <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4, paddingLeft: 8 }}>📁 Folders</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {uniqueFolders.map(folderName => (
                  <button
                    key={folderName}
                    onClick={() => handleSelectFolderFilter(folderName)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11.5px', fontWeight: selectedFolder === folderName ? '750' : '500',
                      background: selectedFolder === folderName ? 'var(--color-app-surface)' : 'transparent',
                      color: selectedFolder === folderName ? 'var(--color-teal)' : 'var(--color-app-muted)',
                      textAlign: 'left'
                    }}
                  >
                    <Folder size={11} /> <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{folderName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderBottom: '1px solid var(--color-app-border)', flexShrink: 0 }}>
            <Search size={13} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search notes body…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 12.5, color: 'var(--color-app-text)' }}
            />
            {search && (
              <button className="df-sugg-dismiss" onClick={() => setSearch('')} style={{ padding: 2 }}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Scrolling Note items list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
            {isLoading ? (
              <LoadingSpinner size={32} />
            ) : notes.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--color-app-faint)', margin: 0 }}>
                  {search || selectedFolder || filterFavOnly ? 'No matching notes found.' : 'No notes found. Create your first note!'}
                </p>
              </div>
            ) : (
              <>
                {/* Pinned Section */}
                {pinnedNotes.length > 0 && (
                  <>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-faint)', padding: '4px 8px 2px', margin: 0 }}>📌 Pinned</p>
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
                    <div style={{ height: 1, background: 'var(--color-app-border)', margin: '6px 8px' }} />
                  </>
                )}

                {/* Regular Section */}
                {regularNotes.length > 0 && (
                  <>
                    {pinnedNotes.length > 0 && (
                      <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-app-faint)', padding: '4px 8px 2px', margin: 0 }}>Notes</p>
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

        {/* RIGHT EDITOR PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {activeNote ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              onUpdate={handleUpdate}
              onTogglePin={handleTogglePin}
            />
          ) : (
            <EmptyState
              icon={<FileText size={48} style={{ color: 'var(--color-app-faint)' }} />}
              title="Notion Lite Notes"
              description='Select a markdown note from the list, or click "New Note" to draft documentation.'
            />
          )}
        </div>
      </div>
    </div>
  )
}
