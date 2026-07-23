/**
 * FocusContext — Global Focus Timer State
 *
 * Lives at the app root so the countdown persists across page navigation
 * and the browser tab title always shows the live time when a session is running.
 */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import api from '@/shared/lib/axios'

const FocusContext = createContext(null)

export function useFocus() {
  const ctx = useContext(FocusContext)
  if (!ctx) throw new Error('useFocus must be used inside FocusProvider')
  return ctx
}

const MODES = [
  { id: 'pomodoro',  label: 'Pomodoro',  minutes: 25, color: '#FF7A1A', icon: '🍅', breakMinutes: 5  },
  { id: 'deep_work', label: 'Deep Work', minutes: 90, color: '#7C3AED', icon: '🧠', breakMinutes: 15 },
]

function fmt(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function FocusProvider({ children }) {
  const qc = useQueryClient()

  // ── Timer state ────────────────────────────────────────────────────────────
  const [mode,         setMode]         = useState(MODES[0])
  const [sessionId,    setSessionId]    = useState(null)
  const [phase,        setPhase]        = useState('idle') // idle | running | break | done
  const [timeLeft,     setTimeLeft]     = useState(MODES[0].minutes * 60)
  const [totalTime,    setTotalTime]    = useState(MODES[0].minutes * 60)
  const [label,        setLabel]        = useState('')
  const [customMins,   setCustomMins]   = useState('')
  const [interruptions,setInterruptions]= useState(0)
  const intervalRef = useRef(null)
  const originalTitle = useRef(document.title)

  // ── Restore active session from server on mount ────────────────────────────
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await api.get('/focus/active')
        const session = data.data
        if (!session) return
        const elapsed    = Math.floor((Date.now() - new Date(session.startedAt)) / 1000)
        const target     = (session.targetMinutes || 25) * 60
        const remaining  = Math.max(0, target - elapsed)
        const m          = MODES.find(m => m.id === session.mode) || MODES[0]
        setMode(m)
        setSessionId(session._id || session.id)
        setLabel(session.label || '')
        setInterruptions(session.interruptions?.length || 0)
        setTotalTime(target)
        setTimeLeft(remaining)
        setPhase('running')
      } catch { /* no session or offline */ }
    }
    restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Countdown tick + document.title update ─────────────────────────────────
  useEffect(() => {
    if (phase !== 'running' && phase !== 'break') {
      clearInterval(intervalRef.current)
      // Restore original title when not running
      document.title = originalTitle.current
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1

        // Update tab title every tick
        const modeIcon = phase === 'break' ? '☕' : mode.icon
        const pageName = document.title.replace(/^[^|—]*[|—]\s*/, '') || 'DevFlow'
        document.title = `${modeIcon} ${fmt(next)} — ${pageName}`

        if (next <= 0) {
          clearInterval(intervalRef.current)

          if (phase === 'running') {
            // Work session done → switch to break
            const breakSecs = mode.breakMinutes * 60
            setPhase('break')
            setTotalTime(breakSecs)
            // Auto-complete server session
            if (sessionId) {
              api.patch(`/focus/sessions/${sessionId}/end`, { status: 'completed' })
                .then(() => qc.invalidateQueries({ queryKey: ['focus'] }))
                .catch(() => {})
            }
            return breakSecs
          } else {
            // Break done
            setPhase('done')
            document.title = originalTitle.current
            return 0
          }
        }

        return next
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [phase, mode, sessionId, qc])

  // ── Actions ────────────────────────────────────────────────────────────────
  const startSession = useCallback(async () => {
    const target = customMins ? parseInt(customMins) : mode.minutes
    try {
      const { data } = await api.post('/focus/sessions', {
        mode: mode.id,
        targetMinutes: target,
        label: label.trim() || undefined,
      })
      const session = data.data
      setSessionId(session._id || session.id)
      setTotalTime(target * 60)
      setTimeLeft(target * 60)
      setPhase('running')
      qc.invalidateQueries({ queryKey: ['focus'] })
    } catch (err) {
      console.error('[Focus] Start failed:', err.message)
    }
  }, [mode, customMins, label, qc])

  const abandonSession = useCallback(async () => {
    clearInterval(intervalRef.current)
    if (sessionId) {
      try {
        await api.patch(`/focus/sessions/${sessionId}/end`, { status: 'abandoned' })
        qc.invalidateQueries({ queryKey: ['focus'] })
      } catch {}
    }
    setSessionId(null)
    setPhase('idle')
    setTimeLeft(mode.minutes * 60)
    setTotalTime(mode.minutes * 60)
    setInterruptions(0)
    setLabel('')
    document.title = originalTitle.current
  }, [sessionId, mode, qc])

  const logInterruption = useCallback(async (note = '') => {
    if (!sessionId) return
    try {
      await api.post(`/focus/sessions/${sessionId}/interrupt`, { note })
      setInterruptions(n => n + 1)
      qc.invalidateQueries({ queryKey: ['focus'] })
    } catch {}
  }, [sessionId, qc])

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current)
    setPhase('idle')
    setTimeLeft(mode.minutes * 60)
    setTotalTime(mode.minutes * 60)
    setInterruptions(0)
    setSessionId(null)
    document.title = originalTitle.current
  }, [mode])

  const selectMode = useCallback((m) => {
    if (phase !== 'idle') return // don't switch mid-session
    setMode(m)
    setTimeLeft(m.minutes * 60)
    setTotalTime(m.minutes * 60)
  }, [phase])

  // Progress 0–1
  const progress = totalTime > 0 ? 1 - timeLeft / totalTime : 0

  return (
    <FocusContext.Provider value={{
      // state
      mode, phase, timeLeft, totalTime, progress,
      label, setLabel,
      customMins, setCustomMins,
      interruptions, sessionId,
      MODES,
      // helpers
      fmt,
      // actions
      selectMode,
      startSession,
      abandonSession,
      logInterruption,
      resetTimer,
    }}>
      {children}
    </FocusContext.Provider>
  )
}
