import { useState, useEffect, useRef, useCallback } from 'react'
import { Pin, PinOff, Save, Tag, X, LoaderCircle } from 'lucide-react'

const AUTOSAVE_DELAY_MS = 1200

/**
 * Full-page markdown note editor with auto-save.
 *
 * @param {{
 *   note: object,
 *   onUpdate: (id: string, updates: object) => Promise<void>,
 *   onTogglePin: (id: string) => void,
 * }} props
 */
export default function NoteEditor({ note, onUpdate, onTogglePin }) {
  const [title,    setTitle]    = useState(note.title ?? 'Untitled Note')
  const [body,     setBody]     = useState(note.body  ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags,     setTags]     = useState(note.tags  ?? [])
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(true)

  const debounceRef = useRef(null)

  // When the active note changes, refresh local state
  useEffect(() => {
    setTitle(note.title ?? 'Untitled Note')
    setBody(note.body   ?? '')
    setTags(note.tags   ?? [])
    setSaved(true)
  }, [note.id])

  const scheduleAutosave = useCallback(
    (updatedTitle, updatedBody, updatedTags) => {
      setSaved(false)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
        setSaving(true)
        try {
          await onUpdate(note.id, {
            title: updatedTitle,
            body:  updatedBody,
            tags:  updatedTags,
          })
          setSaved(true)
        } catch {
          // silently leave saved=false so user can see error on next save
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
    scheduleAutosave(v, body, tags)
  }

  const handleBodyChange = (e) => {
    const v = e.target.value
    setBody(v)
    scheduleAutosave(title, v, tags)
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (!tag || tags.includes(tag)) { setTagInput(''); return }
    const next = [...tags, tag]
    setTags(next)
    setTagInput('')
    scheduleAutosave(title, body, next)
  }

  const removeTag = (tag) => {
    const next = tags.filter((t) => t !== tag)
    setTags(next)
    scheduleAutosave(title, body, next)
  }

  const textareaStyles = {
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
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Editor Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderBottom: '1px solid var(--color-app-border)',
          flexShrink: 0,
        }}
      >
        {/* Save indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: saving
              ? 'var(--color-amber)'
              : saved
              ? 'var(--color-teal)'
              : 'var(--color-app-faint)',
          }}
        >
          {saving ? (
            <LoaderCircle size={12} className="auth-spinner" />
          ) : (
            <Save size={12} />
          )}
          <span>{saving ? 'Saving…' : saved ? 'Saved' : 'Unsaved'}</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Pin toggle */}
        <button
          className="app-btn"
          onClick={() => onTogglePin(note.id)}
          style={{
            padding: '4px 10px',
            fontSize: 12,
            color: note.isPinned ? 'var(--color-amber)' : undefined,
          }}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          {note.isPinned ? <Pin size={13} /> : <PinOff size={13} />}
          <span style={{ marginLeft: 5 }}>{note.isPinned ? 'Pinned' : 'Pin'}</span>
        </button>
      </div>

      {/* Title field */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title…"
          maxLength={200}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-app-text)',
            fontFamily: 'var(--font-sans)',
            padding: 0,
          }}
        />
      </div>

      {/* Tags row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          padding: '10px 24px',
          borderBottom: '1px solid var(--color-app-border)',
          flexShrink: 0,
        }}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-teal)',
              background: 'var(--color-teal-muted)',
              padding: '3px 8px',
              borderRadius: 10,
              textTransform: 'lowercase',
            }}
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', lineHeight: 1 }}
              aria-label={`Remove tag ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
          }}
          placeholder="+ add tag"
          maxLength={30}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 11,
            color: 'var(--color-app-muted)',
            width: 70,
            padding: 0,
          }}
        />
      </div>

      {/* Markdown body textarea */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px 24px 24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <textarea
          value={body}
          onChange={handleBodyChange}
          placeholder={'Write your note in Markdown…\n\n# Heading\n**Bold** or *italic*\n- List item\n\n```js\nconsole.log("code block")\n```'}
          style={textareaStyles}
        />
      </div>
    </div>
  )
}
