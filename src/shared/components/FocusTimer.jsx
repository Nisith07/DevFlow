/**
 * FocusTimer — Inline Sidebar Focus Session Widget
 * 
 * Fits 100% inside the 256px sidebar container. Toggled by the Focus Mode card.
 * Uses global useFocus() context so timer state persists and tab title updates live.
 */
import { Play, Square, AlertCircle, CheckCircle, Timer, X } from 'lucide-react'
import { useFocus } from './FocusContext'

export default function FocusTimer({ onClose }) {
  const {
    mode, phase, timeLeft, progress,
    label, setLabel,
    customMins, setCustomMins,
    interruptions,
    MODES,
    fmt,
    selectMode,
    startSession,
    abandonSession,
    logInterruption,
    resetTimer,
  } = useFocus()

  const circumference = 2 * Math.PI * 38
  const strokeDashoffset = circumference * (1 - progress)
  const onBreak = phase === 'break'

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '12px 10px',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: 'var(--shadow-card-val)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            background: `${mode.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: mode.color,
          }}>
            <Timer size={13} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-app-text)' }}>Focus Timer</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            color: 'var(--color-app-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Close timer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Mode Selector */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          {MODES.map(m => {
            const isSelected = mode.id === m.id
            return (
              <button
                key={m.id}
                onClick={() => selectMode(m)}
                style={{
                  flex: 1,
                  padding: '5px 4px',
                  borderRadius: '8px',
                  border: `1.5px solid ${isSelected ? m.color : 'var(--card-border)'}`,
                  background: isSelected ? `${m.color}18` : 'var(--card-bg-inset)',
                  color: isSelected ? m.color : 'var(--color-app-muted)',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Circular Timer Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <div style={{ position: 'relative', width: '92px', height: '92px' }}>
          <svg width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="46" cy="46" r="38" stroke="var(--card-bg-inset)" strokeWidth="5" fill="none" />
            <circle
              cx="46" cy="46" r="38"
              stroke={onBreak ? '#10B981' : mode.color}
              strokeWidth="5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${onBreak ? '#10B98180' : mode.color + '80'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(timeLeft)}
            </div>
            <div style={{ fontSize: '8px', color: 'var(--color-app-muted)', marginTop: '3px', fontWeight: '600', textTransform: 'uppercase' }}>
              {phase === 'idle' ? mode.label : onBreak ? '☕ Break' : 'Focusing'}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs (Idle mode) */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="What are you working on?"
            value={label}
            onChange={e => setLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '10.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="number"
            placeholder={`Custom duration (default: ${mode.minutes}min)`}
            value={customMins}
            onChange={e => setCustomMins(e.target.value)}
            min="5" max="240"
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '10.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Running Status Bar */}
      {phase === 'running' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          background: 'var(--card-bg-inset)',
          padding: '6px 8px',
          borderRadius: '8px',
          border: '1px solid var(--card-border)',
        }}>
          <div style={{ fontSize: '10px', color: 'var(--color-app-text)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
            {label || mode.label}
          </div>
          <div style={{ fontSize: '9px', color: '#EF4444', fontWeight: '700', background: '#EF444415', padding: '2px 5px', borderRadius: '4px' }}>
            ⚡ {interruptions} int.
          </div>
        </div>
      )}

      {/* Completed state message */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', marginBottom: '10px', padding: '8px', background: '#10B98115', borderRadius: '8px', border: '1px solid #10B98130' }}>
          <CheckCircle size={16} color="#10B981" style={{ marginBottom: '2px' }} />
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#10B981' }}>Complete! 🎉</div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {phase === 'idle' && (
          <button
            onClick={startSession}
            style={{
              width: '100%',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '800',
              fontSize: '11.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              boxShadow: `0 4px 12px ${mode.color}40`,
            }}
          >
            <Play size={12} fill="#fff" />
            Start Focus
          </button>
        )}

        {phase === 'running' && (
          <>
            <button
              onClick={() => logInterruption()}
              title="Log interruption"
              style={{
                flex: 1,
                height: '30px',
                borderRadius: '8px',
                border: '1px solid #EF444440',
                background: '#EF444415',
                color: '#EF4444',
                fontWeight: '700',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <AlertCircle size={11} /> Int.
            </button>
            <button
              onClick={abandonSession}
              style={{
                flex: 1,
                height: '30px',
                borderRadius: '8px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg-inset)',
                color: 'var(--color-app-muted)',
                fontWeight: '700',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <Square size={10} /> Abandon
            </button>
          </>
        )}

        {(phase === 'break' || phase === 'done') && (
          <button
            onClick={resetTimer}
            style={{
              width: '100%',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '800',
              fontSize: '11.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <Play size={12} fill="#fff" /> New Session
          </button>
        )}
      </div>
    </div>
  )
}
