import { useState, useEffect, useRef, useCallback } from 'react'
import { Pin, PinOff, Save, Tag, X, LoaderCircle, Star, Folder, Eye, Edit2, Copy, Image } from 'lucide-react'

const AUTOSAVE_DELAY_MS = 1000

export default function NoteEditor({ note, onUpdate, onTogglePin }) {
  const [title, setTitle] = useState(note.title ?? 'Untitled Note')
  const [body, setBody] = useState(note.body ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(note.tags ?? [])
  const [folder, setFolder] = useState(note.folder ?? '')
  const [isFavorite, setIsFavorite] = useState(note.isFavorite ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const [editMode, setEditMode] = useState('edit') // edit or preview

  const debounceRef = useRef(null)

  useEffect(() => {
    setTitle(note.title ?? 'Untitled Note')
    setBody(note.body ?? '')
    setTags(note.tags ?? [])
    setFolder(note.folder ?? '')
    setIsFavorite(note.isFavorite ?? false)
    setSaved(true)
  }, [note.id])

  const scheduleAutosave = useCallback(
    (updatedTitle, updatedBody, updatedTags, updatedFolder, updatedFav) => {
      setSaved(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        setSaving(true)
        try {
          await onUpdate(note.id, {
            title: updatedTitle,
            body: updatedBody,
            tags: updatedTags,
            folder: updatedFolder,
            isFavorite: updatedFav
          })
          setSaved(true)
        } catch {
          // silent failure handled by saved label
        } finally {
          setSaving(false)
        }
      }, AUTOSAVE_DELAY_MS)
    },
    [note.id, onUpdate]
  )

  const handleTitleChange = (e) => {
    const v = e.target.value
    setTitle(v)
    scheduleAutosave(v, body, tags, folder, isFavorite)
  }

  const handleBodyChange = (e) => {
    const v = e.target.value
    setBody(v)
    scheduleAutosave(title, v, tags, folder, isFavorite)
  }

  const handleFolderChange = (e) => {
    const v = e.target.value
    setFolder(v)
    scheduleAutosave(title, body, tags, v, isFavorite)
  }

  const handleToggleFav = () => {
    const next = !isFavorite
    setIsFavorite(next)
    scheduleAutosave(title, body, tags, folder, next)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || tags.includes(tag)) { setTagInput(''); return }
    const next = [...tags, tag]
    setTags(next)
    setTagInput('')
    scheduleAutosave(title, body, next, folder, isFavorite)
  }

  const removeTag = (tag) => {
    const next = tags.filter((t) => t !== tag)
    setTags(next)
    scheduleAutosave(title, body, next, folder, isFavorite)
  }

  // Visual Markdown Parser supporting code blocks, images, tables, lists, and headers
  const renderMarkdownPreview = () => {
    if (!body.trim()) {
      return <p style={{ color: 'var(--color-app-faint)', fontStyle: 'italic' }}>Note is empty. Switch to Edit mode to write content.</p>
    }

    // Split markdown blocks by code blocks or general lines
    const blocks = body.split(/(```[\s\S]*?```)/g)
    
    return blocks.map((block, i) => {
      // 1. Code Block Visualizer
      if (block.startsWith('```')) {
        const codeText = block.replace(/```[a-zA-Z]*\n/, '').replace(/```$/, '')
        return (
          <div key={i} style={{ position: 'relative', margin: '16px 0', background: '#090e1a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Source Code</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codeText)
                  alert('Copied to clipboard!')
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}
              >
                <Copy size={11} /> Copy
              </button>
            </div>
            <pre style={{ margin: 0, padding: '14px', overflowX: 'auto', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: '#38bdf8', lineHeight: 1.5 }}>
              <code>{codeText}</code>
            </pre>
          </div>
        )
      }

      // 2. Parse general markdown lines (headers, lists, tables, images, paragraphs)
      const lines = block.split('\n')
      let inTable = false
      let tableRows = []

      return lines.map((line, j) => {
        // Table Parser
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          inTable = true
          const cols = line.split('|').map(s => s.trim()).filter((_, colIdx, arr) => colIdx > 0 && colIdx < arr.length - 1)
          // Check if line is division header line e.g. |---|---|
          const isDiv = cols.every(c => c.match(/^-+$/))
          if (!isDiv) {
            tableRows.push(cols)
          }

          // If next line is not a table row or this is the last line, render the completed table block!
          const nextLine = lines[j + 1]
          const isNextRow = nextLine && nextLine.trim().startsWith('|') && nextLine.trim().endsWith('|')
          if (!isNextRow && tableRows.length > 0) {
            const rowsToRender = [...tableRows]
            tableRows = []
            inTable = false
            return (
              <div key={j} style={{ overflowX: 'auto', margin: '14px 0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {rowsToRender[0].map((col, cIdx) => (
                        <th key={cIdx} style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', fontWeight: 'bold' }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rowsToRender.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {row.map((col, cIdx) => (
                          <td key={cIdx} style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>{col}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
          return null
        }

        if (inTable) return null

        // Image Parser: ![alt](url)
        const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/)
        if (imgMatch) {
          return (
            <div key={j} style={{ margin: '14px 0', textAlign: 'center' }}>
              <img src={imgMatch[2]} alt={imgMatch[1]} style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }} />
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-app-muted)', marginTop: '4px' }}>{imgMatch[1]}</span>
            </div>
          )
        }

        // Headers
        if (line.startsWith('### ')) {
          return <h4 key={j} style={{ color: 'var(--color-app-text)', marginTop: '16px', marginBottom: '8px', fontWeight: '700' }}>{line.slice(4)}</h4>
        }
        if (line.startsWith('## ')) {
          return <h3 key={j} style={{ color: 'var(--color-teal)', marginTop: '20px', marginBottom: '10px', fontWeight: '800' }}>{line.slice(3)}</h3>
        }
        if (line.startsWith('# ')) {
          return <h2 key={j} style={{ color: 'var(--color-teal)', marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>{line.slice(2)}</h2>
        }

        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={j} style={{ marginLeft: '14px', marginBottom: '4px', listStyleType: 'disc', color: 'var(--color-app-text)' }}>
              {renderLineText(line.slice(2))}
            </li>
          )
        }

        return <p key={j} style={{ margin: '0 0 10px 0', minHeight: line === '' ? 12 : 'auto', color: 'var(--color-app-text)', fontSize: '13.5px', lineHeight: 1.6 }}>{renderLineText(line)}</p>
      })
    })
  }

  const renderLineText = (line) => {
    let parts = [line]
    const boldRegex = /\*\*(.*?)\*\*/g
    if (boldRegex.test(line)) {
      parts = []
      let lastIdx = 0
      let match
      boldRegex.lastIndex = 0
      while ((match = boldRegex.exec(line)) !== null) {
        parts.push(line.substring(lastIdx, match.index))
        parts.push(<strong key={match.index} style={{ color: 'var(--color-teal)', fontWeight: '700' }}>{match[1]}</strong>)
        lastIdx = boldRegex.lastIndex
      }
      parts.push(line.substring(lastIdx))
    }
    return parts
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--color-app-border)', flexShrink: 0 }}>
        {/* Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: saving ? 'var(--color-amber)' : saved ? 'var(--color-teal)' : 'var(--color-app-faint)' }}>
          {saving ? <LoaderCircle size={12} className="auth-spinner" /> : <Save size={12} />}
          <span>{saving ? 'Saving…' : saved ? 'Saved' : 'Unsaved'}</span>
        </div>

        {/* Folder Label input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16 }}>
          <Folder size={12} style={{ color: 'var(--color-app-muted)' }} />
          <input
            type="text"
            placeholder="No Folder"
            value={folder}
            onChange={handleFolderChange}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '11.5px',
              fontWeight: '600',
              color: 'var(--color-app-text)',
              width: '90px',
              padding: 0
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        {/* View Mode Toggle (Edit / Preview) */}
        <div style={{ display: 'flex', background: 'var(--color-app-bg)', padding: '2px', borderRadius: '6px', border: '1px solid var(--color-app-border)' }}>
          <button
            onClick={() => setEditMode('edit')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: editMode === 'edit' ? 'var(--color-app-surface)' : 'transparent',
              color: editMode === 'edit' ? '#fff' : 'var(--color-app-faint)'
            }}
          >
            <Edit2 size={10} /> Edit
          </button>
          <button
            onClick={() => setEditMode('preview')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: editMode === 'preview' ? 'var(--color-app-surface)' : 'transparent',
              color: editMode === 'preview' ? '#fff' : 'var(--color-app-faint)'
            }}
          >
            <Eye size={10} /> Preview
          </button>
        </div>

        {/* Favorite star */}
        <button
          className="app-btn"
          onClick={handleToggleFav}
          style={{ padding: '4px 10px', fontSize: 12, color: isFavorite ? 'var(--color-amber)' : undefined }}
          title={isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
        >
          <Star size={13} fill={isFavorite ? 'var(--color-amber)' : 'none'} />
          <span style={{ marginLeft: 5 }}>Fav</span>
        </button>

        {/* Pin toggle */}
        <button
          className="app-btn"
          onClick={() => onTogglePin(note.id)}
          style={{ padding: '4px 10px', fontSize: 12, color: note.isPinned ? 'var(--color-amber)' : undefined }}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? <Pin size={13} /> : <PinOff size={13} />}
          <span style={{ marginLeft: 5 }}>Pin</span>
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title…"
          maxLength={200}
          disabled={editMode === 'preview'}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-app-text)',
            padding: 0,
          }}
        />
      </div>

      {/* Tags row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', padding: '10px 24px', borderBottom: '1px solid var(--color-app-border)', flexShrink: 0 }}>
        {tags.map((tag) => (
          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--color-teal)', background: 'rgba(79, 184, 168, 0.08)', padding: '3px 8px', borderRadius: 10 }}>
            #{tag}
            {editMode !== 'preview' && (
              <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', lineHeight: 1 }}>
                <X size={10} />
              </button>
            )}
          </span>
        ))}
        {editMode !== 'preview' && (
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
            }}
            placeholder="+ add tag"
            maxLength={30}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 11, color: 'var(--color-app-muted)', width: 70, padding: 0 }}
          />
        )}
      </div>

      {/* Editor Body */}
      <div style={{ flex: 1, minHeight: 0, padding: '16px 24px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {editMode === 'edit' ? (
          <textarea
            value={body}
            onChange={handleBodyChange}
            placeholder={'Write your note in Markdown…\n\n# Heading\n**Bold** or *italic*\n- List item\n\n| Column 1 | Column 2 |\n|---|---|\n| Table row 1 | Table details |\n\n![Workspace Image](https://images.unsplash.com/photo-1498050108023-c5249f4df085)\n\n```js\nconsole.log("code block")\n```'}
            style={{
              flex: 1,
              width: '100%',
              background: 'none',
              border: 'none',
              outline: 'none',
              resize: 'none',
              color: 'var(--color-app-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.8,
              padding: 0,
            }}
          />
        ) : (
          <div className="markdown-preview-pane">
            {renderMarkdownPreview()}
          </div>
        )}
      </div>
    </div>
  )
}
