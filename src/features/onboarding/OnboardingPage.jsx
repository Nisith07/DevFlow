import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'
import OnboardingMemoryScreen from './OnboardingMemoryScreen'
import OnboardingComplete from './OnboardingComplete'

import Step1Role       from './steps/Step1Role'
import Step2TechStack  from './steps/Step2TechStack'
import Step3Tools      from './steps/Step3Tools'
import Step4Project    from './steps/Step4Project'
import Step5Goals      from './steps/Step5Goals'
import Step6Schedule   from './steps/Step6Schedule'
import Step7Focus      from './steps/Step7Focus'
import Step8AI         from './steps/Step8AI'
import Step9Workspace  from './steps/Step9Workspace'

const STEPS = [
  { Component: Step1Role,      label: 'Who are you?' },
  { Component: Step2TechStack, label: 'Tech Stack' },
  { Component: Step3Tools,     label: 'Connect Tools' },
  { Component: Step4Project,   label: 'Your Project' },
  { Component: Step5Goals,     label: 'Your Goals' },
  { Component: Step6Schedule,  label: 'Work Schedule' },
  { Component: Step7Focus,     label: 'Focus Mode' },
  { Component: Step8AI,        label: 'AI Personalization' },
  { Component: Step9Workspace, label: 'Build Workspace' },
]

const INITIAL_DATA = {
  role: '',
  techStack: [],
  connectedTools: ['github'],
  mainProject: { name: '', description: '', framework: '', repository: '' },
  goals: [],
  schedule: { preferredTime: '', hoursPerDay: 4, morningBriefing: true },
  focusSettings: { pomodoroDuration: 25, autoStartNext: false },
  aiPreferences: { experience: '', tone: '', helpStyle: [] },
  dashboardWidgets: [],
}

export default function OnboardingPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const { mutateAsync: submitOnboarding, isPending } = useOnboarding()

  const [step, setStep]          = useState(0)  // 0-based, 0–8
  const [formData, setFormData]  = useState(INITIAL_DATA)
  const [phase, setPhase]        = useState('steps') // 'steps' | 'memory' | 'complete'

  const totalSteps    = STEPS.length
  const progressPct   = Math.round(((step + 1) / totalSteps) * 100)
  const { Component } = STEPS[step]

  const updateData = (patch) => setFormData((prev) => ({ ...prev, ...patch }))

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  const goNext = async () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
    } else {
      // Last step → submit then show memory screen
      try {
        await submitOnboarding(formData)
      } catch {
        // Silent — memory screen still plays even on error
      }
      setPhase('memory')
    }
  }

  const skip = async () => {
    // Mark onboarded with current partial data, go straight to dashboard
    try {
      await submitOnboarding(formData)
    } catch {
      // ignore
    }
    navigate('/dashboard', { replace: true })
  }

  // ── Render phases ─────────────────────────────────────────────
  if (phase === 'memory') {
    return <OnboardingMemoryScreen onDone={() => setPhase('complete')} />
  }

  if (phase === 'complete') {
    return <OnboardingComplete data={formData} />
  }

  // Get first name only
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="ob-root">
      {/* Background decorative orbs */}
      <div className="ob-orb ob-orb--1" />
      <div className="ob-orb ob-orb--2" />
      <div className="ob-orb ob-orb--3" />

      <div className="ob-shell">
        {/* ── Top brand bar ──────────────────────────── */}
        <div className="ob-brand-bar">
          <div className="ob-brand">
            <img src="/logo-icon.svg" alt="" className="ob-brand-logo" />
            <span>Dev<span className="ob-brand-accent">Flow</span></span>
          </div>
          <button className="ob-skip-btn" onClick={skip} disabled={isPending}>
            <SkipForward size={14} />
            Skip for now
          </button>
        </div>

        {/* ── Welcome headline (only on step 0) ──────── */}
        {step === 0 && (
          <div className="ob-welcome">
            <div className="ob-welcome-wave">👋</div>
            <h1 className="ob-welcome-title">Welcome to DevFlow, {firstName}!</h1>
            <p className="ob-welcome-sub">Let's personalize your workspace. This only takes about 2 minutes.</p>
          </div>
        )}

        {/* ── Progress bar ───────────────────────────── */}
        <div className="ob-progress-wrap">
          <div className="ob-progress-track">
            <div className="ob-progress-fill" style={{ width: `${progressPct}%` }} />
            {/* Step dots */}
            {STEPS.map((s, i) => (
              <div
                key={i}
                className={`ob-progress-dot ${i < step ? 'ob-progress-dot--done' : i === step ? 'ob-progress-dot--active' : ''}`}
                style={{ left: `${(i / (totalSteps - 1)) * 100}%` }}
                title={s.label}
              />
            ))}
          </div>
          <div className="ob-progress-meta">
            <span className="ob-progress-pct">{progressPct}%</span>
            <span className="ob-progress-label">{STEPS[step].label}</span>
          </div>
        </div>

        {/* ── Step card ──────────────────────────────── */}
        <div className="ob-card" key={step}>
          <Component data={formData} onChange={updateData} />
        </div>

        {/* ── Navigation buttons ─────────────────────── */}
        <div className="ob-nav">
          <button
            className="ob-btn ob-btn--ghost"
            onClick={goBack}
            disabled={step === 0}
          >
            <ChevronLeft size={17} /> Back
          </button>

          <div className="ob-step-dots">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`ob-dot ${i === step ? 'ob-dot--active' : i < step ? 'ob-dot--done' : ''}`}
              />
            ))}
          </div>

          <button
            className="ob-btn ob-btn--primary"
            onClick={goNext}
            disabled={isPending}
          >
            {step < totalSteps - 1 ? (
              <>Next <ChevronRight size={17} /></>
            ) : (
              isPending ? 'Saving…' : 'Finish 🚀'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
