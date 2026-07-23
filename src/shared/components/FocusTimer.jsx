/**
 * FocusTimer — Floating Focus Session Widget
 * 
 * Pops out cleanly to the right of the sidebar in the bottom-left workspace corner.
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

  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference * (1 - progress)
  const onBreak = phase === 'break'

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '20px',
      width: '280px',
      boxSizing: 'border-box',
      boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px var(--card-border)',
      backdropFilter: 'blur(24px)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '8px',
            background: `${mode.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: mode.color,
          }}>
            <Timer size={15} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1.2 }}>Focus Timer</div>
            <div style={{ fontSize: '9.5px', color: 'var(--color-app-muted)', fontWeight: '500' }}>Deep Work Companion</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'var(--card-bg-inset)',
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            width: '26px',
            height: '26px',
            cursor: 'pointer',
            color: 'var(--color-app-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title="Close timer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Mode Selector (Grid Layout) */}
      {phase === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {MODES.map(m => {
            const isSelected = mode.id === m.id
            return (
              <button
                key={m.id}
                onClick={() => selectMode(m)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: `1.5px solid ${isSelected ? m.color : 'var(--card-border)'}`,
                  background: isSelected ? `${m.color}18` : 'var(--card-bg-inset)',
                  color: isSelected ? m.color : 'var(--color-app-muted)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '110px', height: '110px' }}>
          <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r="44" stroke="var(--card-bg-inset)" strokeWidth="6" fill="none" />
            <circle
              cx="55" cy="55" r="44"
              stroke={onBreak ? '#10B981' : mode.color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 10px ${onBreak ? '#10B98180' : mode.color + '80'})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {fmt(timeLeft)}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--color-app-muted)', marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {phase === 'idle' ? mode.label : onBreak ? '☕ Break' : 'Focusing'}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs (Idle mode) */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="What are you working on?"
            value={label}
            onChange={e => setLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '11.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="number"
            placeholder={`Custom minutes (default: ${mode.minutes}m)`}
            value={customMins}
            onChange={e => setCustomMins(e.target.value)}
            min="5" max="240"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--card-border)',
              background: 'var(--card-bg-inset)',
              color: 'var(--color-app-text)',
              fontSize: '11.5px',
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
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          background: 'var(--card-bg-inset)',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid var(--card-border)',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--color-app-text)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {label || mode.label}
          </div>
          <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: '700', background: '#EF444415', padding: '2px 6px', borderRadius: '4px' }}>
            ⚡ {interruptions} int.
          </div>
        </div>
      )}

      {/* Completed state message */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', marginBottom: '14px', padding: '12px', background: '#10B98115', borderRadius: '12px', border: '1px solid #10B98130' }}>
          <CheckCircle size={20} color="#10B981" style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#10B981' }}>Session Complete! 🎉</div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-app-muted)', marginTop: '2px' }}>
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
              width: '100%',
              height: '38px',
              borderRadius: '10px',
              border: 'none',
              background: `linear-gradient(135deg, ${mode.color}, ${mode.color}DD)`,
              color: '#fff',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: `0 6px 16px ${mode.color}40`,
              transition: 'transform 0.15s ease',
            }}
          >
            <Play size={14} fill="#fff" />
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
                height: '36px',
                borderRadius: '10px',
                border: '1px solid #EF444440',
                background: '#EF444415',
                color: '#EF4444',
                fontWeight: '700',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <AlertCircle size={13} /> Interrupted
            </button>
            <button
              onClick={abandonSession}
              style={{
                flex: 1,
                height: '36px',
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
                gap: '4px',
              }}
            >
              <Square size={12} /> Abandon
            </button>
          </>
        )}

        {(phase === 'break' || phase === 'done') && (
          <button
            onClick={resetTimer}
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '10px',
              border: 'none',
              background: mode.color,
              color: '#fff',
              fontWeight: '800',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Play size={14} fill="#fff" /> New Session
          </button>
        )}
      </div>
    </div>
  )
}
