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

const DEFAULT_SNIPPETS = [
  {
    id: 's1',
    title: 'JWT Bearer Authentication Middleware',
    description: 'Express.js middleware for verifying JWT bearer tokens in request headers.',
    language: 'javascript',
    category: 'Backend',
    code: `import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized access' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}`,
    isFavorite: true
  },
  {
    id: 's2',
    title: 'React Custom Debounce Hook',
    description: 'Custom React hook for debouncing search input values with custom delay.',
    language: 'javascript',
    category: 'Frontend',
    code: `import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}`,
    isFavorite: false
  },
  {
    id: 's3',
    title: 'PostgreSQL Connection Pool Config',
    description: 'Production-ready pg-pool configuration with max connections and idle timeout.',
    language: 'sql',
    category: 'Database',
    code: `const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

module.exports = pool`,
    isFavorite: true
  }
]

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
  const [copiedId, setCopiedId] = useState(false)

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

  // Determine list of snippets to display (fallback to DEFAULT_SNIPPETS if DB empty and no search filter)
  const displaySnippets = (snippets.length > 0 || search || selectedLang || selectedCat || favOnly) 
    ? snippets 
    : DEFAULT_SNIPPETS

  // Auto-select first snippet when activeSnippet is null
  useEffect(() => {
    if (!activeSnippet && displaySnippets.length > 0) {
      setActiveSnippet(displaySnippets[0])
    }
  }, [displaySnippets, activeSnippet])

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
      if (activeSnippet.id.startsWith('s')) {
        // Fallback default edit in local state
        const updated = {
          ...activeSnippet,
          title: formTitle.trim(),
          description: formDesc.trim(),
          code: formCode,
          language: formLang,
          category: formCat,
        }
        setActiveSnippet(updated)
      } else {
        const updated = await updateSnippet({
          id: activeSnippet.id,
          title: formTitle.trim(),
          description: formDesc.trim(),
          code: formCode,
          language: formLang,
          category: formCat,
        })
        setActiveSnippet(updated)
      }
      setIsEditing(false)
    } catch {
      // error handled by mutation
    }
  }

  // Create new snippet
  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!formTitle.trim() || !formCode.trim()) return
    try {
      const created = await createSnippet({
        title: formTitle.trim(),
        description: formDesc.trim(),
        code: formCode,
        language: formLang,
        category: formCat,
      })
      setActiveSnippet(created)
      setShowCreateModal(false)
      setFormTitle('')
      setFormDesc('')
      setFormCode('')
    } catch {
      // error handled by mutation
    }
  }

  // Delete snippet
  const handleDeleteSnippet = async (id) => {
    if (id.startsWith('s')) return
    if (confirm('Delete this code snippet?')) {
      await deleteSnippet(id)
      if (activeSnippet?.id === id) {
        setActiveSnippet(null)
      }
    }
  }

  // Copy code snippet to clipboard
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Share link simulation
  const handleShareSnippet = (id) => {
    navigator.clipboard.writeText(window.location.href)
    alert('Snippet link copied to clipboard!')
  }

  // Clear filters
  const handleClearFilters = () => {
    setSearch('')
    setSelectedLang('')
    setSelectedCat('')
    setFavOnly(false)
  }

  // Get Language badge color
  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript': return '#E8A33D'
      case 'python': return '#38BDF8'
      case 'html': return '#F97316'
      case 'css': return '#A78BFA'
      case 'sql': return '#10B981'
      case 'bash': return '#EC4899'
      default: return '#38BDF8'
    }
  }

  const selectStyle = {
    padding: '9px 12px',
    background: 'var(--card-bg-inset)',
    border: '1px solid var(--card-border)',
    borderRadius: '8px',
    color: 'var(--color-app-text)',
    fontSize: '12.5px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div style={{ flexShrink: 0 }}>
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
          border: '1px solid var(--card-border)',
          borderRadius: 14,
          overflow: 'hidden',
          background: 'var(--color-app-surface)'
        }}
      >
        {/* SIDEBAR: Filters */}
        <div style={{ borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', padding: '16px' }}>
          {/* Quick Clear Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Filters</span>
            {(search || selectedLang || selectedCat || favOnly) && (
              <button onClick={handleClearFilters} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Clear all</button>
            )}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-app-muted)' }} />
            <input
              type="text"
              placeholder="Search code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 30px',
                background: 'var(--card-bg-inset)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                color: 'var(--color-app-text)',
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
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Categories</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11.5px', textAlign: 'left',
                    background: selectedCat === cat ? 'var(--card-bg-inset)' : 'transparent',
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
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Languages</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(selectedLang === lang.id ? '' : lang.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '11.5px', textAlign: 'left',
                    background: selectedLang === lang.id ? 'var(--card-bg-inset)' : 'transparent',
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
          <div style={{ borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Snippet Library ({displaySnippets.length})</span>
            </div>

            <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isLoading ? (
                <LoadingSpinner size={32} />
              ) : displaySnippets.length === 0 ? (
                <div style={{ padding: '30px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontSize: '12.5px', color: 'var(--color-app-muted)', margin: 0 }}>No matching snippets found.</p>
                  <button className="app-btn primary" onClick={() => setShowCreateModal(true)} style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                    <Plus size={13} />
                    <span>Create Snippet</span>
                  </button>
                </div>
              ) : (
                displaySnippets.map(s => {
                  const isActive = activeSnippet?.id === s.id
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSnippet(s)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: isActive ? 'var(--card-bg-inset)' : 'transparent',
                        border: isActive ? '1px solid var(--accent-color)' : '1px solid var(--card-border)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 'bold', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
                          {s.title}
                        </span>
                        
                        <div style={{ display: 'flex', gap: 2 }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleFavorite(s.id)}
                            style={{ background: 'none', border: 'none', color: s.isFavorite ? 'var(--color-amber)' : 'var(--color-app-muted)', cursor: 'pointer', padding: 2 }}
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
                        <span style={{ fontSize: '8px', padding: '1px 5px', borderRadius: '4px', background: 'var(--card-bg-inset)', color: 'var(--color-app-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--color-app-text)' }}>Edit Snippet</h3>
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
                <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  
                  {/* Title Header Toolbar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--card-border)', paddingBottom: 12, gap: 10 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--color-app-text)' }}>{activeSnippet.title}</h2>
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
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'var(--card-bg-inset)', color: 'var(--color-app-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Category: {activeSnippet.category}
                    </span>
                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: `${getLanguageColor(activeSnippet.language)}1a`, color: getLanguageColor(activeSnippet.language), textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Language: {activeSnippet.language}
                    </span>
                  </div>

                  {/* Code block canvas */}
                  <div style={{ display: 'flex', flexDirection: 'column', background: '#090e1a', border: '1px solid var(--card-border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Terminal size={11} /> <span>Snippet Body</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(activeSnippet.code)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '11px', fontWeight: '600' }}
                      >
                        {copiedId ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                        <span>{copiedId ? 'Copied!' : 'Copy Code'}</span>
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
                icon={<FolderCode size={48} />}
                title="Select a Snippet"
                description="Choose a code block from your collection, or create a new code utility."
                action={
                  <button className="app-btn primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={14} />
                    <span>Create Snippet</span>
                  </button>
                }
              />
            )}
          </div>

        </div>
      </div>

      {/* CREATE SNIPPET MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <form onSubmit={handleCreateSubmit} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: 'var(--shadow-dropdown-val)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-app-text)' }}>Create Code Snippet</h3>
              <button type="button" className="app-btn" onClick={() => setShowCreateModal(false)} style={{ padding: 4 }}><X size={14} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Snippet Title</label>
              <input type="text" placeholder="e.g. Async Fetch Wrapper" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required style={selectStyle} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Description</label>
              <input type="text" placeholder="e.g. Reusable wrapper for axios API calls" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} style={selectStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Language</label>
                <select value={formLang} onChange={(e) => setFormLang(e.target.value)} style={selectStyle}>
                  {LANGUAGES.map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Category</label>
                <select value={formCat} onChange={(e) => setFormCat(e.target.value)} style={selectStyle}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Code Content</label>
              <textarea rows={8} placeholder="Paste code snippet here..." value={formCode} onChange={(e) => setFormCode(e.target.value)} required style={{ ...selectStyle, fontFamily: 'var(--font-mono)', resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="button" className="app-btn" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button type="submit" className="app-btn primary">Save Snippet</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
