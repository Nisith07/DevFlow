/**
 * FocusTimer — Floating Focus Session Widget
 * 
 * Uses global useFocus() context so countdown persists across page navigation,
 * sidebar toggles, and updates the browser tab title live (e.g. 🍅 24:59 — DevFlow).
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

  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference * (1 - progress)
  const onBreak = phase === 'break'

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '18px 16px',
      width: '270px',
      boxSizing: 'border-box',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--card-border)',
      backdropFilter: 'blur(20px)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Timer size={15} color={mode.color} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Focus Timer</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'var(--card-bg-inset)',
            border: '1px solid var(--card-border)',
            borderRadius: '6px',
            padding: '3px',
            cursor: 'pointer',
            color: 'var(--color-app-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title="Close timer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Mode Selector */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => selectMode(m)}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '8px',
                border: `1.5px solid ${mode.id === m.id ? m.color : 'var(--card-border)'}`,
                background: mode.id === m.id ? `${m.color}18` : 'transparent',
                color: mode.id === m.id ? m.color : 'var(--color-app-muted)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
              }}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Circular Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
        <div style={{ position: 'relative', width: '104px', height: '104px' }}>
          <svg width="104" height="104" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="52" cy="52" r="44" stroke="var(--card-bg-inset)" strokeWidth="6" fill="none" />
            <circle
              cx="52" cy="52" r="44"
              stroke={onBreak ? '#10B981' : mode.color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 8px ${onBreak ? '#10B98180' : mode.color + '80'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '21px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(timeLeft)}
            </div>
            <div style={{ fontSize: '8.5px', color: 'var(--color-app-muted)', marginTop: '3px', fontWeight: '600' }}>
              {phase === 'idle' ? mode.label : onBreak ? '☕ Break' : 'Focus'}
            </div>
          </div>
        </div>
      </div>

      {/* Label Input */}
      {phase === 'idle' && (
        <>
          <input
            type="text"
            placeholder="What are you working on?"
            value={label}
            onChange={e => setLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '11px',
              outline: 'none',
              marginBottom: '8px',
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
              padding: '8px 10px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '11px',
              outline: 'none',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          />
        </>
      )}

      {/* Status Bar */}
      {phase === 'running' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
            {label || mode.label}
          </div>
          <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: '600' }}>
            ⚡ {interruptions} int.
          </div>
        </div>
      )}

      {/* Completed state */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', marginBottom: '12px', padding: '10px', background: '#10B98115', borderRadius: '10px', border: '1px solid #10B98130' }}>
          <CheckCircle size={18} color="#10B981" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#10B981' }}>Session Complete! 🎉</div>
          <div style={{ fontSize: '10px', color: 'var(--color-app-muted)', marginTop: '2px' }}>
            {interruptions} interruption{interruptions !== 1 ? 's' : ''} logged
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {phase === 'idle' && (
          <button
            onClick={startSession}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: `0 4px 12px ${mode.color}40`,
            }}
          >
            <Play size={13} fill="#fff" />
            Start Focus
          </button>
        )}

        {phase === 'running' && (
          <>
            <button
              onClick={() => logInterruption()}
              title="Log interruption"
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #EF444440',
                background: '#EF444415',
                color: '#EF4444',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <AlertCircle size={12} /> Interrupted
            </button>
            <button
              onClick={abandonSession}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '10px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg-inset)',
                color: 'var(--color-app-muted)',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
              }}
            >
              <Square size={11} /> Abandon
            </button>
          </>
        )}

        {(phase === 'break' || phase === 'done') && (
          <button
            onClick={resetTimer}
            style={{
              flex: 1,
              padding: '9px',
              borderRadius: '10px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Play size={13} fill="#fff" /> New Session
          </button>
        )}
      </div>
    </div>
  )
}
