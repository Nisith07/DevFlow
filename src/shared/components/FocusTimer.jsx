/**
 * FocusTimer — Floating Focus Session Widget
 * 
 * A Pomodoro / Deep Work timer that floats over the sidebar.
 * Connects to real /api/v1/focus/* endpoints to persist sessions.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Play, Pause, Square, Zap, AlertCircle, CheckCircle, Coffee, Timer, X, ChevronDown, ChevronUp } from 'lucide-react'
import api from '@/shared/lib/axios'
import { useActiveSession } from '@/features/dashboard/hooks/useDashboard'

const MODES = [
  { id: 'pomodoro', label: 'Pomodoro', minutes: 25, color: '#FF7A1A', icon: '🍅', breakMinutes: 5 },
  { id: 'deep_work', label: 'Deep Work', minutes: 90, color: '#7C3AED', icon: '🧠', breakMinutes: 15 },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function FocusTimer({ onClose }) {
  const qc = useQueryClient()
  const { data: activeSession, isLoading: sessionLoading } = useActiveSession()

  const [mode, setMode] = useState(MODES[0])
  const [customMinutes, setCustomMinutes] = useState('')
  const [label, setLabel] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [running, setRunning] = useState(false)
  const [onBreak, setOnBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(mode.minutes * 60)
  const [totalTime, setTotalTime] = useState(mode.minutes * 60)
  const [interruptions, setInterruptions] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | running | break | done
  const intervalRef = useRef(null)

  // If there's an active server session, restore it
  useEffect(() => {
    if (activeSession && !sessionId) {
      setSessionId(activeSession._id || activeSession.id)
      const elapsed = Math.floor((Date.now() - new Date(activeSession.startedAt)) / 1000)
      const target = (activeSession.targetMinutes || 25) * 60
      const remaining = Math.max(0, target - elapsed)
      setTimeLeft(remaining)
      setTotalTime(target)
      setRunning(true)
      setPhase('running')
      const m = MODES.find(m => m.id === activeSession.mode) || MODES[0]
      setMode(m)
      setLabel(activeSession.label || '')
      setInterruptions(activeSession.interruptions?.length || 0)
    }
  }, [activeSession, sessionId])

  // Countdown
  useEffect(() => {
    if (running && !onBreak) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setPhase('break')
            setOnBreak(true)
            setTimeLeft(mode.breakMinutes * 60)
            setTotalTime(mode.breakMinutes * 60)
            // Auto complete the server session
            if (sessionId) {
              api.patch(`/focus/sessions/${sessionId}/end`, { status: 'completed' })
                .then(() => qc.invalidateQueries({ queryKey: ['focus'] }))
                .catch(() => {})
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (onBreak && running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setPhase('done')
            setCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, onBreak, sessionId, mode.breakMinutes, qc])

  // Start session mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      const target = customMinutes ? parseInt(customMinutes) : mode.minutes
      const { data } = await api.post('/focus/sessions', {
        mode: mode.id,
        targetMinutes: target,
        label: label.trim() || undefined,
      })
      return data.data
    },
    onSuccess: (session) => {
      const target = customMinutes ? parseInt(customMinutes) : mode.minutes
      setSessionId(session._id || session.id)
      setTimeLeft(target * 60)
      setTotalTime(target * 60)
      setRunning(true)
      setPhase('running')
      setCompleted(false)
      qc.invalidateQueries({ queryKey: ['focus'] })
    },
  })

  // Abandon mutation
  const abandonMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return
      await api.patch(`/focus/sessions/${sessionId}/end`, { status: 'abandoned' })
    },
    onSuccess: () => {
      clearInterval(intervalRef.current)
      setRunning(false)
      setSessionId(null)
      setPhase('idle')
      setTimeLeft(mode.minutes * 60)
      setTotalTime(mode.minutes * 60)
      setOnBreak(false)
      setCompleted(false)
      setInterruptions(0)
      qc.invalidateQueries({ queryKey: ['focus'] })
    },
  })

  // Log interruption
  const logInterruption = useCallback(async () => {
    if (!sessionId) return
    try {
      await api.post(`/focus/sessions/${sessionId}/interrupt`, { note: '' })
      setInterruptions(prev => prev + 1)
      qc.invalidateQueries({ queryKey: ['focus'] })
    } catch {}
  }, [sessionId, qc])

  const handleStart = () => startMutation.mutate()
  const handleAbandon = () => abandonMutation.mutate()
  const handleReset = () => {
    setPhase('idle')
    setTimeLeft(mode.minutes * 60)
    setTotalTime(mode.minutes * 60)
    setOnBreak(false)
    setCompleted(false)
    setInterruptions(0)
    setSessionId(null)
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  const progress = totalTime > 0 ? (1 - timeLeft / totalTime) : 0
  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '20px',
      width: '260px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Timer size={14} color={mode.color} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-app-text)' }}>Focus Timer</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-app-muted)', display: 'flex', alignItems: 'center' }}>
          <X size={14} />
        </button>
      </div>

      {/* Mode Selector */}
      {phase === 'idle' && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m); setTimeLeft(m.minutes * 60); setTotalTime(m.minutes * 60) }}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '8px',
                border: `1.5px solid ${mode.id === m.id ? m.color : 'var(--card-border)'}`,
                background: mode.id === m.id ? `${m.color}18` : 'transparent',
                color: mode.id === m.id ? m.color : 'var(--color-app-muted)',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Circular Timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" stroke="var(--card-bg-inset)" strokeWidth="6" fill="none" />
            <circle
              cx="50" cy="50" r="44"
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
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--color-app-text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ fontSize: '8px', color: 'var(--color-app-muted)', marginTop: '2px', fontWeight: '600' }}>
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
              padding: '7px 10px',
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
            value={customMinutes}
            onChange={e => setCustomMinutes(e.target.value)}
            min="5" max="240"
            style={{
              width: '100%',
              padding: '7px 10px',
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
          <div style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>
            {label || mode.label}
          </div>
          <div style={{ fontSize: '10px', color: '#EF4444', fontWeight: '600' }}>
            ⚡ {interruptions} interruption{interruptions !== 1 ? 's' : ''}
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
            onClick={handleStart}
            disabled={startMutation.isPending}
            style={{
              flex: 1,
              padding: '8px',
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
              gap: '5px',
              opacity: startMutation.isPending ? 0.7 : 1,
            }}
          >
            <Play size={13} />
            {startMutation.isPending ? 'Starting...' : 'Start Focus'}
          </button>
        )}

        {phase === 'running' && (
          <>
            <button
              onClick={logInterruption}
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
              onClick={handleAbandon}
              disabled={abandonMutation.isPending}
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
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '8px',
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
              gap: '5px',
            }}
          >
            <Play size={13} /> New Session
          </button>
        )}
      </div>
    </div>
  )
}
