import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'
import OnboardingMemoryScreen from './OnboardingMemoryScreen'
import OnboardingComplete from './OnboardingComplete'

import Step1Role          from './steps/Step1Role'
import Step2TechStack     from './steps/Step2TechStack'
import Step3Project       from './steps/Step4Project'   // reuse project file
import Step4GoalsSchedule from './steps/Step4GoalsSchedule'
import Step5AIQuick       from './steps/Step5AIQuick'

const STEPS = [
  { Component: Step1Role,          label: 'Your Role',     emoji: '👤' },
  { Component: Step2TechStack,     label: 'Tech Stack',    emoji: '⚡' },
  { Component: Step3Project,       label: 'Your Project',  emoji: '🧠' },
  { Component: Step4GoalsSchedule, label: 'Goals',         emoji: '🎯' },
  { Component: Step5AIQuick,       label: 'AI Vibe',       emoji: '✨' },
]

const INITIAL_DATA = {
  role: '',
  techStack: [],
  connectedTools: ['github'],
  mainProject: { name: '', description: '', framework: '', repository: '' },
  goals: [],
  schedule: { preferredTime: 'evening', hoursPerDay: 4, morningBriefing: true },
  focusSettings: { pomodoroDuration: 25, autoStartNext: false },
  aiPreferences: { experience: '', tone: 'friendly', helpStyle: ['debug', 'generate'] },
  dashboardWidgets: ['focus', 'github', 'deploy', 'ai', 'analytics', 'sprint', 'notes'],
}

export default function OnboardingPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const { mutateAsync: submitOnboarding, isPending } = useOnboarding()

  const [step, setStep]         = useState(0)
  const [formData, setFormData] = useState(INITIAL_DATA)
  const [phase, setPhase]       = useState('steps') // 'steps' | 'memory' | 'complete'
  const [direction, setDir]     = useState(1) // 1=forward, -1=backward

  const totalSteps   = STEPS.length
  const progressPct  = Math.round(((step + 1) / totalSteps) * 100)
  const { Component } = STEPS[step]

  const updateData = (patch) => setFormData((prev) => ({ ...prev, ...patch }))

  const goBack = () => {
    if (step > 0) { setDir(-1); setStep((s) => s - 1) }
  }

  const goNext = async () => {
    if (step < totalSteps - 1) {
      setDir(1)
      setStep((s) => s + 1)
    } else {
      try { await submitOnboarding(formData) } catch { /* silent */ }
      setPhase('memory')
    }
  }

  const skip = async () => {
    try { await submitOnboarding(formData) } catch { /* ignore */ }
    navigate('/dashboard', { replace: true })
  }

  if (phase === 'memory')   return <OnboardingMemoryScreen onDone={() => setPhase('complete')} />
  if (phase === 'complete') return <OnboardingComplete data={formData} />

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="ob-root">
      {/* Ambient orbs */}
      <div className="ob-orb ob-orb--1" />
      <div className="ob-orb ob-orb--2" />

      <div className="ob-shell">

        {/* ── Brand + skip ── */}
        <div className="ob-brand-bar">
          <div className="ob-brand">
            <img src="/logo-icon.svg" alt="" className="ob-brand-logo" />
            <span>Dev<span className="ob-brand-accent">Flow</span></span>
          </div>
          <button className="ob-skip-btn" onClick={skip} disabled={isPending}>
            <Zap size={13} /> Skip setup
          </button>
        </div>

        {/* ── Welcome (step 0 only) ── */}
        {step === 0 && (
          <div className="ob-welcome">
            <p className="ob-welcome-greeting">👋 Hey {firstName}!</p>
            <h1 className="ob-welcome-title">Let's set up your workspace</h1>
            <p className="ob-welcome-sub">5 quick steps · takes under 2 minutes</p>
          </div>
        )}

        {/* ── Step breadcrumb tabs ── */}
        <div className="ob-steps-row">
          {STEPS.map((s, i) => (
            <div key={i} className={`ob-step-tab ${i === step ? 'ob-step-tab--active' : i < step ? 'ob-step-tab--done' : ''}`}>
              <span className="ob-step-tab-num">{i < step ? '✓' : i + 1}</span>
              <span className="ob-step-tab-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Progress bar (thin) ── */}
        <div className="ob-progress-bar">
          <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        {/* ── Step card ── */}
        <div className="ob-card" key={step}>
          <Component data={formData} onChange={updateData} />
        </div>

        {/* ── Nav ── */}
        <div className="ob-nav">
          <button
            className="ob-btn ob-btn--ghost"
            onClick={goBack}
            disabled={step === 0}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <span className="ob-nav-hint">
            {step + 1} of {totalSteps}
          </span>

          <button
            className="ob-btn ob-btn--primary"
            onClick={goNext}
            disabled={isPending}
          >
            {step < totalSteps - 1
              ? <><span>Next</span> <ChevronRight size={16} /></>
              : <span>{isPending ? 'Setting up…' : 'Finish 🚀'}</span>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
