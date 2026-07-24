import { useState } from 'react'
import { GripVertical } from 'lucide-react'

const DEFAULT_WIDGETS = [
  { id: 'focus',    emoji: '🎯', label: "Today's Focus" },
  { id: 'github',   emoji: '🐙', label: 'GitHub Activity' },
  { id: 'deploy',   emoji: '🚀', label: 'Deployments' },
  { id: 'ai',       emoji: '🤖', label: 'AI Copilot' },
  { id: 'analytics',emoji: '📊', label: 'Analytics' },
  { id: 'calendar', emoji: '📅', label: 'Calendar' },
  { id: 'sprint',   emoji: '🏃', label: 'Sprint' },
  { id: 'notes',    emoji: '📓', label: 'Notes' },
  { id: 'planner',  emoji: '📌', label: 'Planner' },
  { id: 'feed',     emoji: '⚡', label: 'Activity Feed' },
]

export default function Step9Workspace({ data, onChange }) {
  const widgetIds = data.dashboardWidgets?.length
    ? data.dashboardWidgets
    : DEFAULT_WIDGETS.map((w) => w.id)

  // Ordered list derived from stored ids
  const ordered = widgetIds
    .map((id) => DEFAULT_WIDGETS.find((w) => w.id === id))
    .filter(Boolean)

  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  const handleDragStart = (i) => setDragIdx(i)
  const handleDragOver  = (e, i) => { e.preventDefault(); setOverIdx(i) }

  const handleDrop = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return }
    const next = [...ordered]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(i, 0, moved)
    onChange({ dashboardWidgets: next.map((w) => w.id) })
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 9 of 9</div>
      <h2 className="ob-step-title">Build Your Workspace</h2>
      <p className="ob-step-sub">Drag to reorder — the top widgets appear first on your dashboard.</p>

      <div className="ob-widget-list">
        {ordered.map((widget, i) => (
          <div
            key={widget.id}
            className={`ob-widget-row ${overIdx === i ? 'ob-widget-row--over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
          >
            <GripVertical size={16} className="ob-widget-grip" />
            <span className="ob-widget-emoji">{widget.emoji}</span>
            <span className="ob-widget-label">{widget.label}</span>
            <span className="ob-widget-rank">#{i + 1}</span>
          </div>
        ))}
      </div>

      <p className="ob-step-hint">You can always rearrange widgets later from your dashboard settings.</p>
    </div>
  )
}
