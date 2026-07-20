import { useState, useEffect } from 'react'
import {
  Code, Plus, Search, Star, Copy, Share2, Trash2, Edit3, X, Check, Eye, ExternalLink, ChevronRight, FolderCode, Terminal
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { useSnippets } from './hooks/useSnippets'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript 💛' },
  { id: 'python', label: 'Python 💙' },
  { id: 'html', label: 'HTML5 🧡' },
  { id: 'css', label: 'CSS3 💜' },
  { id: 'sql', label: 'SQL Database 💚' },
  { id: 'bash', label: 'Bash Terminal 🐚' }
]

const CATEGORIES = ['Utility', 'Frontend', 'Backend', 'Database', 'DevOps']

export default function SnippetPage() {
  // Query Filters state
  const [search, setSearch] = useState('')
  const [selectedLang, setSelectedLang] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [favOnly, setFavOnly] = useState(false)

  // Selected snippet for view/edit panel
  const [activeSnippet, setActiveSnippet] = useState(null)
  
  // Modal/Form states
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Edit / Add Form fields state
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formLang, setFormLang] = useState('javascript')
  const [formCat, setFormCat] = useState('Utility')

  // Build filters for custom hooks query
  const filters = {}
  if (search.trim()) filters.search = search.trim()
  if (selectedLang) filters.language = selectedLang
  if (selectedCat) filters.category = selectedCat
  if (favOnly) filters.favorite = 'true'

  const {
    snippets = [],
    isLoading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite
  } = useSnippets(filters)

  // Handle select/unselect active
  const handleSelectSnippet = (s) => {
    setActiveSnippet(s)
    setIsEditing(false)
  }

  // Set fields when entering Edit Mode
  const handleStartEdit = () => {
    if (!activeSnippet) return
    setFormTitle(activeSnippet.title)
    setFormDesc(activeSnippet.description || '')
    setFormCode(activeSnippet.code)
    setFormLang(activeSnippet.language)
    setFormCat(activeSnippet.category)
    setIsEditing(true)
  }

  // Save edits mutation
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!formTitle.trim() || !formCode.trim()) return
    try {
      const updated = await updateSnippet({
        id: activeSnippet.id,
        title: formTitle.trim(),
        description: formDesc.trim(),
        code: formCode,
        language: formLang,
        category: formCat
      })
      setActiveSnippet(updated)
      setIsEditing(false)
    } catch (err) {
      alert('Failed to save changes.')
    }
  }

  // Create snippet mutation
  const handleCreateSnippet = async (e) => {
    e.preventDefault()
    if (!formTitle.trim() || !formCode.trim()) return
    try {
      const created = await createSnippet({
        title: formTitle.trim(),
        description: formDesc.trim(),
        code: formCode,
        language: formLang,
        category: formCat,
        isFavorite: false
      })
      setShowCreateModal(false)
      setActiveSnippet(created)
      // Reset form
      setFormTitle('')
      setFormDesc('')
      setFormCode('')
      setFormLang('javascript')
      setFormCat('Utility')
    } catch (err) {
      alert('Failed to create snippet.')
    }
  }

  // Delete snippet
  const handleDeleteSnippet = async (id) => {
    if (!window.confirm('Permanently delete this code snippet?')) return
    try {
      await deleteSnippet(id)
      if (activeSnippet?.id === id) setActiveSnippet(null)
    } catch (err) {
      alert('Failed to delete snippet.')
    }
  }

  // Copy code utility
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  // Share snippet url utility
  const handleShareSnippet = (id) => {
    const url = `https://devflow.snippets.pub/share/${id}`
    navigator.clipboard.writeText(url)
    alert(`Share URL copied to clipboard:\n${url}`)
  }

  const handleClearFilters = () => {
    setSearch('')
    setSelectedLang('')
    setSelectedCat('')
    setFavOnly(false)
  }

  const selectStyle = {
    padding: '8px 12px',
    background: 'var(--color-app-bg)',
    border: '1px solid var(--color-app-border)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '100%'
  }

  // Custom styled syntax highlight simulation
  const getLanguageColor = (lang) => {
    switch (lang) {
      case 'javascript': return '#eab308'
      case 'python': return '#3b82f6'
      case 'html': return '#f97316'
      case 'css': return '#a855f7'
      case 'sql': return '#22c55e'
      default: return '#6b7280'
    }
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ paddingBottom: 16 }}>
        <PageHeader
          title="Code Snippets"
          subtitle="Your personal multi-language code utility library with instant syntax preview."
          action={
            <button className="app-btn primary" onClick={() => { setShowCreateModal(true); setIsEditing(false); }}>
              <Plus size={16} />
              <span>New Snippet</span>
            </button>
          }
        />
      </div>

      {/* Main Grid split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 0,
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--color-app-border)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--color-app-bg)'
        }}
      >
        {/* SIDEBAR: Filters */}
        <div style={{ borderRight: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', padding: '16px' }}>
          {/* Quick Clear Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Filters</span>
            {(search || selectedLang || selectedCat || favOnly) && (
              <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Clear all</button>
            )}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-app-faint)' }} />
            <input
              type="text"
              placeholder="Search code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 30px',
                background: 'var(--color-app-surface)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>

          {/* Favorite filter */}
          <button
            onClick={() => setFavOnly(!favOnly)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', marginBottom: 20,
              background: favOnly ? 'rgba(232, 163, 61, 0.08)' : 'transparent',
              color: favOnly ? 'var(--color-amber)' : 'var(--color-app-muted)',
              fontWeight: '600'
            }}
          >
            <Star size={13} fill={favOnly ? 'var(--color-amber)' : 'none'} />
            <span>Show Favorites Only</span>
          </button>

          {/* Category Filter list */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Categories</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11.5px', textAlign: 'left',
                    background: selectedCat === cat ? 'var(--color-app-surface)' : 'transparent',
                    color: selectedCat === cat ? 'var(--color-teal)' : 'var(--color-app-muted)',
                    fontWeight: selectedCat === cat ? 'bold' : '500'
                  }}
                >
                  <span>{cat}</span>
                  {selectedCat === cat && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter list */}
          <div>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Languages</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(selectedLang === lang.id ? '' : lang.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11.5px', textAlign: 'left',
                    background: selectedLang === lang.id ? 'var(--color-app-surface)' : 'transparent',
                    color: selectedLang === lang.id ? 'var(--color-teal)' : 'var(--color-app-muted)',
                    fontWeight: selectedLang === lang.id ? 'bold' : '500'
                  }}
                >
                  <span>{lang.label}</span>
                  {selectedLang === lang.id && <Check size={10} />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* MAIN PANEL split */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: 0 }}>
          
          {/* MIDDLE COLUMN: Snippet items list */}
          <div style={{ borderRight: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Snippet Library ({snippets.length})</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isLoading ? (
                <LoadingSpinner size={32} />
              ) : snippets.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-app-faint)' }}>No matching snippets found.</p>
                </div>
              ) : (
                snippets.map(s => {
                  const isActive = activeSnippet?.id === s.id
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSnippet(s)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--color-app-surface)' : 'rgba(255,255,255,0.01)',
                        border: isActive ? '1px solid var(--color-teal)' : '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: '#fff', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
                          {s.title}
                        </span>
                        
                        <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleFavorite(s.id)}
                            style={{ background: 'none', border: 'none', color: s.isFavorite ? 'var(--color-amber)' : 'var(--color-app-faint)', cursor: 'pointer', padding: 2 }}
                          >
                            <Star size={11} fill={s.isFavorite ? 'var(--color-amber)' : 'none'} />
                          </button>
                          <button
                            onClick={() => handleDeleteSnippet(s.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 2 }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>

                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-app-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {s.description || 'No description provided.'}
                      </p>

                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--color-app-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {s.category}
                        </span>
                        <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '4px', background: `${getLanguageColor(s.language)}1a`, color: getLanguageColor(s.language), textTransform: 'uppercase', fontWeight: 'bold' }}>
                          {s.language}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Snippet Viewer & Editor Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {activeSnippet ? (
              isEditing ? (
                /* EDIT FORM PANEL */
                <form onSubmit={handleSaveEdit} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Edit Snippet</h3>
                    <button type="button" className="app-btn" onClick={() => setIsEditing(false)} style={{ padding: 4 }}><X size={14} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Snippet Title</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required style={selectStyle} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Description</label>
                    <input type="text" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={selectStyle} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Language</label>
                      <select value={formLang} onChange={(e) => setFormLang(e.target.value)} style={selectStyle}>
                        {LANGUAGES.map(l => (
                          <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Category</label>
                      <select value={formCat} onChange={(e) => setFormCat(e.target.value)} style={selectStyle}>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0 }}>
                    <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Code Content</label>
                    <textarea rows={12} value={formCode} onChange={(e) => setFormCode(e.target.value)} required style={{ ...selectStyle, flex: 1, fontFamily: 'var(--font-mono)', resize: 'none' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="button" className="app-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className="app-btn primary">Save Updates</button>
                  </div>
                </form>
              ) : (
                /* CODE SNIPPET INSPECTOR & HIGHLIGHT VISUAL */
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  {/* Title Header Toolbar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 12, gap: 10 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>{activeSnippet.title}</h2>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--color-app-muted)' }}>{activeSnippet.description || 'No description provided.'}</p>
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button className="app-btn" onClick={handleStartEdit} style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Edit3 size={11} /> <span>Edit</span>
                      </button>
                      <button className="app-btn" onClick={() => handleShareSnippet(activeSnippet.id)} style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Share2 size={11} /> <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata labels row */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', color: 'var(--color-app-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Category: {activeSnippet.category}
                    </span>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: `${getLanguageColor(activeSnippet.language)}1a`, color: getLanguageColor(activeSnippet.language), textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Language: {activeSnippet.language}
                    </span>
                  </div>

                  {/* Code block canvas */}
                  <div style={{ display: 'flex', flexDirection: 'column', background: '#090e1a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Terminal size={11} /> <span>Snippet Body</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(activeSnippet.code)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', fontWeight: '600' }}
                      >
                        <Copy size={11} /> Copy Code
                      </button>
                    </div>
                    <pre style={{ margin: 0, padding: '16px', overflowX: 'auto', fontSize: '13px', fontFamily: 'var(--font-mono)', color: '#38bdf8', lineHeight: 1.6 }}>
                      <code>{activeSnippet.code}</code>
                    </pre>
                  </div>

                </div>
              )
            ) : (
              <EmptyState
                icon={<Code size={48} style={{ color: 'var(--color-app-faint)' }} />}
                title="Select a Snippet"
                description="Choose a code block from your collection, or add utility helpers directly."
              />
            )}
          </div>

        </div>
      </div>

      {/* CREATE SNIPPET MODAL OVERLAY */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '560px', padding: '24px', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>Create Code Snippet</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-app-muted)', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <form onSubmit={handleCreateSnippet} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Snippet Title</label>
                <input type="text" placeholder="e.g. Debounce Utility" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Description</label>
                <input type="text" placeholder="Explain what this code does..." value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={selectStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Language</label>
                  <select value={formLang} onChange={(e) => setFormLang(e.target.value)} style={selectStyle}>
                    {LANGUAGES.map(l => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Category</label>
                  <select value={formCat} onChange={(e) => setFormCat(e.target.value)} style={selectStyle}>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Code Content</label>
                <textarea rows={8} placeholder="Paste snippet code here..." value={formCode} onChange={(e) => setFormCode(e.target.value)} required style={{ ...selectStyle, fontFamily: 'var(--font-mono)', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="app-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="app-btn primary">Create Snippet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
