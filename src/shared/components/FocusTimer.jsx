/**
 * FocusTimer — Ultra-Compact Sidebar Focus Session Widget
 * 
 * Fits 100% inside the 256px sidebar container with zero overflow or scrollbars.
 * Uses global useFocus() context so timer state persists and tab title updates live.
 */
import { Play, Square, AlertCircle, CheckCircle, Timer, X } from 'lucide-react'
import { useFocus } from './FocusContext'

export default function FocusTimer({ onClose }) {
  const {
    mode, phase, timeLeft, progress,
    label, setLabel,
    interruptions,
    MODES,
    fmt,
    selectMode,
    startSession,
    abandonSession,
    logInterruption,
    resetTimer,
  } = useFocus()

  const circumference = 2 * Math.PI * 30
  const strokeDashoffset = circumference * (1 - progress)
  const onBreak = phase === 'break'

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '14px',
      padding: '10px 8px 8px',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: 'var(--shadow-card-val)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            background: `${mode.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: mode.color,
          }}>
            <Timer size={12} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-app-text)' }}>Focus Timer</span>
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
          <X size={12} />
        </button>
      </div>

      {/* Mode Selector */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {MODES.map(m => {
            const isSelected = mode.id === m.id
            return (
              <button
                key={m.id}
                onClick={() => selectMode(m)}
                style={{
                  flex: 1,
                  padding: '4px',
                  borderRadius: '6px',
                  border: `1px solid ${isSelected ? m.color : 'var(--card-border)'}`,
                  background: isSelected ? `${m.color}18` : 'transparent',
                  color: isSelected ? m.color : 'var(--color-app-muted)',
                  fontSize: '9.5px',
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

      {/* Ultra Compact Circular Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div style={{ position: 'relative', width: '72px', height: '72px' }}>
          <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="30" stroke="var(--card-bg-inset)" strokeWidth="4" fill="none" />
            <circle
              cx="36" cy="36" r="30"
              stroke={onBreak ? '#10B981' : mode.color}
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 5px ${onBreak ? '#10B98180' : mode.color + '80'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(timeLeft)}
            </div>
            <div style={{ fontSize: '7.5px', color: 'var(--color-app-muted)', marginTop: '2px', fontWeight: '600', textTransform: 'uppercase' }}>
              {phase === 'idle' ? mode.label : onBreak ? '☕ Break' : 'Focus'}
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      {phase === 'idle' && (
        <input
          type="text"
          placeholder="What are you working on?"
          value={label}
          onChange={e => setLabel(e.target.value)}
          style={{
            width: '100%',
            padding: '5px 7px',
            borderRadius: '6px',
            border: '1px solid var(--card-border)',
            background: 'var(--card-bg-inset)',
            color: 'var(--color-app-text)',
            fontSize: '10px',
            outline: 'none',
            marginBottom: '8px',
            boxSizing: 'border-box',
          }}
        />
      )}

      {/* Running Status Bar */}
      {phase === 'running' && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
          background: 'var(--card-bg-inset)',
          padding: '4px 6px',
          borderRadius: '6px',
          border: '1px solid var(--card-border)',
        }}>
          <div style={{ fontSize: '9.5px', color: 'var(--color-app-text)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
            {label || mode.label}
          </div>
          <div style={{ fontSize: '8.5px', color: '#EF4444', fontWeight: '700', background: '#EF444415', padding: '1px 4px', borderRadius: '3px' }}>
            ⚡ {interruptions} int.
          </div>
        </div>
      )}

      {/* Completed state message */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', marginBottom: '8px', padding: '6px', background: '#10B98115', borderRadius: '6px', border: '1px solid #10B98130' }}>
          <CheckCircle size={14} color="#10B981" style={{ marginBottom: '2px' }} />
          <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#10B981' }}>Complete! 🎉</div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '5px' }}>
        {phase === 'idle' && (
          <button
            onClick={startSession}
            style={{
              width: '100%',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '800',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              boxShadow: `0 3px 10px ${mode.color}40`,
            }}
          >
            <Play size={11} fill="#fff" />
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
                height: '26px',
                borderRadius: '6px',
                border: '1px solid #EF444440',
                background: '#EF444415',
                color: '#EF4444',
                fontWeight: '700',
                fontSize: '9.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <AlertCircle size={10} /> Int.
            </button>
            <button
              onClick={abandonSession}
              style={{
                flex: 1,
                height: '26px',
                borderRadius: '6px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg-inset)',
                color: 'var(--color-app-muted)',
                fontWeight: '700',
                fontSize: '9.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <Square size={9} /> Abandon
            </button>
          </>
        )}

        {(phase === 'break' || phase === 'done') && (
          <button
            onClick={resetTimer}
            style={{
              width: '100%',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '800',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Play size={11} fill="#fff" /> New Session
          </button>
        )}
      </div>
    </div>
  )
}
