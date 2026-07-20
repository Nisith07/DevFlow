import { useState, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight, Trash2, Calendar, Check, Circle, Sparkles,
  Plus, CheckSquare, Clock, AlertTriangle, AlertCircle, Video, Play, Award, Zap
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { usePlanner, useWeeklyGoals } from './hooks/usePlanner'
import PlannerSidebar from './components/PlannerSidebar'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'
import api from '@/shared/lib/axios'

// Get ISO week identifier (e.g. "2026-W30")
function getWeekIdentifier(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

const TYPE_COLORS = {
  focus_task: '#10b981', // green
  meeting: '#a78bfa',    // purple
  routine: '#38bdf8',    // sky blue
  other: '#94a3b8'       // slate
}

const TYPE_LABELS = {
  focus_task: 'Focus Task 🎯',
  meeting: 'Meeting 👥',
  routine: 'Routine ⚙️',
  other: 'Other ☕'
}

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState('daily') // daily, weekly, timeline
  const [currentDate, setCurrentDate] = useState(new Date())

  // Date Strings
  const dateStr = currentDate.toLocaleDateString('en-CA')
  const weekStr = getWeekIdentifier(currentDate)

  // Hooks
  const {
    entries,
    isLoading: isLoadingPlanner,
    createEntry,
    updateEntry,
    deleteEntry,
  } = usePlanner(dateStr)

  const {
    goals,
    isLoading: isLoadingWeekly,
    createGoal,
    updateGoal,
    deleteGoal
  } = useWeeklyGoals(weekStr)

  const { tasks, isLoading: isLoadingTasks } = useTasks()
  const { projects, isLoading: isLoadingProjects } = useProjects()

  // Weekly Goals Form State
  const [newGoalTitle, setNewGoalTitle] = useState('')

  // AI Planner Recommendations State
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)

  const handlePrevDay = () => {
    setCurrentDate((d) => {
      const copy = new Date(d)
      copy.setDate(copy.getDate() - 1)
      return copy
    })
  }

  const handleNextDay = () => {
    setCurrentDate((d) => {
      const copy = new Date(d)
      copy.setDate(copy.getDate() + 1)
      return copy
    })
  }

  const handleScheduleTask = async (task) => {
    const startTime = window.prompt('Enter start time (e.g., 09:00):', '09:00')
    if (startTime === null) return
    const endTime = window.prompt('Enter end time (e.g., 10:00):', '10:00')
    if (endTime === null) return

    try {
      await createEntry({
        task: task.id,
        title: task.title,
        startTime,
        endTime,
        type: 'focus_task',
      })
    } catch (err) {
      alert(err.message || 'Failed to schedule task.')
    }
  }

  const handleCreateFreeform = async (blockData) => {
    try {
      await createEntry(blockData)
    } catch (err) {
      alert(err.message || 'Failed to create block.')
    }
  }

  const handleToggleDone = async (entry) => {
    try {
      await updateEntry({
        id: entry.id,
        done: !entry.done,
      })
    } catch (err) {
      alert(err.message || 'Failed to update entry.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this time block?')) return
    try {
      await deleteEntry(id)
    } catch (err) {
      alert(err.message || 'Failed to delete entry.')
    }
  }

  // Weekly Goals methods
  const handleAddWeeklyGoal = async (e) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return
    try {
      await createGoal(newGoalTitle.trim())
      setNewGoalTitle('')
    } catch (err) {
      alert('Failed to add weekly goal')
    }
  }

  const handleToggleWeeklyGoal = async (goal) => {
    try {
      await updateGoal({ id: goal.id, done: !goal.done })
    } catch (err) {
      alert('Failed to update weekly goal')
    }
  }

  const handleDeleteWeeklyGoal = async (id) => {
    if (!window.confirm('Remove this weekly goal?')) return
    try {
      await deleteGoal(id)
    } catch (err) {
      alert('Failed to delete weekly goal')
    }
  }

  // AI AUTO-PLANNER RECOMMENDATIONS
  const handleGenerateAISchedule = async () => {
    setIsGeneratingAI(true)
    setAiRecommendations([])
    const backlogTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').slice(0, 5)
    const taskTitles = backlogTasks.map(t => t.title)

    try {
      // Use the copilot route to generate recommendations
      const response = await api.post('/ai/copilot/run', {
        capability: 'generate_code',
        prompt: `Based on these backlog tasks: ${JSON.stringify(taskTitles)}, design a recommended daily schedule for today. Create 3 hourly blocks representing focus time, coding, and team review. Return JSON array matching format: [{"title": "Block Title", "startTime": "09:00", "endTime": "10:00", "type": "focus_task"}]`
      })

      // Extract JSON array block from markdown response
      const aiResponse = response.data.data.response
      const jsonMatch = aiResponse.match(/\[\s*{[\s\S]*}\s*\]/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        setAiRecommendations(parsed)
      } else {
        // Fallback mockup recommendations if parsing fails or fallback runs
        setAiRecommendations([
          { title: taskTitles[0] || 'Focus Coding Run', startTime: '09:00', endTime: '11:00', type: 'focus_task' },
          { title: 'Project Sync & Standup', startTime: '11:00', endTime: '11:30', type: 'meeting' },
          { title: taskTitles[1] || 'Code Reviews & Backlog Grooming', startTime: '14:00', endTime: '15:30', type: 'routine' },
        ])
      }
      setShowAIModal(true)
    } catch (err) {
      // Fallback details
      setAiRecommendations([
        { title: taskTitles[0] || 'Focus Coding Run', startTime: '09:00', endTime: '11:00', type: 'focus_task' },
        { title: 'Project Sync & Standup', startTime: '11:00', endTime: '11:30', type: 'meeting' },
        { title: taskTitles[1] || 'Code Reviews & Backlog Grooming', startTime: '14:00', endTime: '15:30', type: 'routine' },
      ])
      setShowAIModal(true)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleApplyAISchedule = async () => {
    try {
      for (const rec of aiRecommendations) {
        await createEntry(rec)
      }
      setShowAIModal(false)
      setAiRecommendations([])
    } catch (err) {
      alert('Failed to apply AI schedule blocks.')
    }
  }

  // Timeline and Deadlines math
  const getDeadlineAlerts = () => {
    const today = new Date()
    const alertList = []

    tasks.forEach(t => {
      if (t.dueDate && t.status !== 'done' && t.status !== 'cancelled') {
        const diffTime = new Date(t.dueDate) - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 7) {
          alertList.push({ type: 'task', title: t.title, daysLeft: diffDays, date: t.dueDate })
        }
      }
    })

    projects.forEach(p => {
      if (p.deadline) {
        const diffTime = new Date(p.deadline) - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays <= 14) {
          alertList.push({ type: 'project', title: p.title || p.name, daysLeft: diffDays, date: p.deadline })
        }
      }
    })

    return alertList.sort((a, b) => a.daysLeft - b.daysLeft)
  }

  const deadlineAlerts = getDeadlineAlerts()

  const formattedDateHeader = currentDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const formattedWeekHeader = `Week ${weekStr.split('-W')[1]} (${weekStr.split('-W')[0]})`

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      
      {/* Top Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <PageHeader
          title="Planner"
          subtitle="Time-block your day, track weekly goals, and manage project sprint milestones."
        />

        {/* Tab Controls */}
        <div style={{ display: 'flex', background: 'var(--color-app-surface)', borderRadius: 8, padding: 4, border: '1px solid var(--color-app-border)' }}>
          <button
            onClick={() => setActiveTab('daily')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: activeTab === 'daily' ? 'var(--color-app-bg)' : 'transparent',
              color: activeTab === 'daily' ? '#fff' : 'var(--color-app-faint)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            <Clock size={13} />
            <span>Daily Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: activeTab === 'weekly' ? 'var(--color-app-bg)' : 'transparent',
              color: activeTab === 'weekly' ? '#fff' : 'var(--color-app-faint)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            <CheckSquare size={13} />
            <span>Weekly Focus</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: activeTab === 'timeline' ? 'var(--color-app-bg)' : 'transparent',
              color: activeTab === 'timeline' ? '#fff' : 'var(--color-app-faint)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            <Calendar size={13} />
            <span>Sprints & Timelines</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT RENDER */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        
        {/* 1. DAILY SCHEDULE TAB */}
        {activeTab === 'daily' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Day Switcher Toolbar */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                background: 'var(--color-app-surface)',
                border: '1px solid rgba(255,255,255,0.03)',
                borderRadius: '12px'
              }}
            >
              <button className="app-btn" onClick={handlePrevDay} style={{ padding: '6px 12px' }}>
                <ChevronLeft size={16} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 750, color: 'var(--color-app-text)', fontSize: '14.5px' }}>
                <Calendar size={16} style={{ color: 'var(--color-amber)' }} />
                <span>{formattedDateHeader}</span>
              </div>
              <button className="app-btn" onClick={handleNextDay} style={{ padding: '6px 12px' }}>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Daily Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              {/* Left Blocks Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="card" style={{ flex: 1, minHeight: 450, padding: 24, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>
                      Today's Schedule Blocks
                    </h3>

                    <button
                      className="app-btn primary"
                      disabled={isGeneratingAI}
                      onClick={handleGenerateAISchedule}
                      style={{
                        padding: '6px 14px',
                        background: 'linear-gradient(135deg, var(--color-teal), #0284c7)',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isGeneratingAI ? (
                        <>
                          <LoaderCircle size={13} className="auth-spinner" />
                          <span>Generating Plan...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} style={{ color: 'var(--color-amber)' }} />
                          <span>AI Auto-Schedule</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isLoadingPlanner ? (
                    <LoadingSpinner size={40} />
                  ) : entries.length === 0 ? (
                    <EmptyState
                      icon={<Calendar size={48} style={{ color: 'var(--color-app-muted)' }} />}
                      title="Your Day is Clear"
                      description="Create customized time blocks for meetings, routine admin syncs, or select a backlog task to schedule."
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {entries.map((entry) => {
                        const isMeeting = entry.type === 'meeting'
                        const colorAccent = TYPE_COLORS[entry.type] || TYPE_COLORS.focus_task
                        return (
                          <div
                            key={entry.id}
                            style={{
                              padding: '14px 16px',
                              background: 'var(--color-app-surface)',
                              borderLeft: `4px solid ${colorAccent}`,
                              borderTop: '1px solid rgba(255,255,255,0.03)',
                              borderRight: '1px solid rgba(255,255,255,0.03)',
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              borderRadius: '4px 8px 8px 4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 12,
                              opacity: entry.done ? 0.6 : 1,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                              <button
                                className={`df-check-btn ${entry.done ? 'checked' : ''}`}
                                onClick={() => handleToggleDone(entry)}
                                style={{
                                  background: entry.done ? colorAccent : 'transparent',
                                  borderColor: entry.done ? 'transparent' : 'rgba(255,255,255,0.2)'
                                }}
                              >
                                {entry.done ? <Check size={14} style={{ color: '#fff' }} /> : <Circle size={14} style={{ color: 'transparent' }} />}
                              </button>
                              
                              <div style={{ minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: 13.5,
                                    fontWeight: 700,
                                    margin: 0,
                                    color: entry.done ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                                    textDecoration: entry.done ? 'line-through' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                  }}
                                >
                                  {isMeeting && <Video size={13} style={{ color: 'var(--color-violet-bright)' }} />}
                                  <span>{entry.task ? entry.task.title : entry.title}</span>
                                </p>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-app-muted)' }}>
                                    {entry.startTime} – {entry.endTime}
                                  </span>
                                  <span style={{
                                    fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase',
                                    padding: '1px 6px', borderRadius: '4px', background: `${colorAccent}15`, color: colorAccent
                                  }}>
                                    {TYPE_LABELS[entry.type] || 'Focus Task'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="df-sugg-dismiss"
                              onClick={() => handleDelete(entry.id)}
                              style={{ padding: 4, color: 'var(--color-danger)' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <PlannerSidebar
                  onScheduleTask={handleScheduleTask}
                  onCreateFreeform={handleCreateFreeform}
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. WEEKLY FOCUS TAB */}
        {activeTab === 'weekly' && (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20 }}>
            {/* Left list block */}
            <div className="card" style={{ padding: 24, minHeight: 400 }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)' }}>
                    Weekly Focus Targets
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--color-app-muted)' }}>
                    {formattedWeekHeader}
                  </p>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--color-teal)', fontWeight: 'bold', background: 'rgba(79, 184, 168, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
                  {goals.filter(g => g.done).length} / {goals.length} Completed
                </span>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddWeeklyGoal} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <input
                  type="text"
                  placeholder="Create high-level weekly objective (e.g. Finish Sprint 3 review)..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: 'var(--color-app-surface)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <button type="submit" className="app-btn primary" style={{ height: '38px', padding: '0 16px' }}>
                  <Plus size={15} /> Add Goal
                </button>
              </form>

              {/* Checklist */}
              {isLoadingWeekly ? (
                <LoadingSpinner size={30} />
              ) : goals.length === 0 ? (
                <EmptyState
                  icon={<CheckSquare size={44} style={{ color: 'var(--color-app-muted)' }} />}
                  title="No Weekly Focus Set"
                  description="Setting weekly targets keeps developers aligned with sprint milestones. Add your first goal above."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {goals.map(goal => (
                    <div
                      key={goal.id}
                      style={{
                        padding: '12px 14px',
                        background: 'var(--color-app-surface)',
                        border: '1px solid var(--color-app-border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        opacity: goal.done ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                        <button
                          className={`df-check-btn ${goal.done ? 'checked' : ''}`}
                          onClick={() => handleToggleWeeklyGoal(goal)}
                          style={{
                            background: goal.done ? 'var(--color-teal)' : 'transparent',
                            borderColor: goal.done ? 'transparent' : 'rgba(255,255,255,0.2)'
                          }}
                        >
                          {goal.done ? <Check size={14} style={{ color: '#fff' }} /> : <Circle size={14} style={{ color: 'transparent' }} />}
                        </button>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--color-app-text)', textDecoration: goal.done ? 'line-through' : 'none' }}>
                          {goal.title}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteWeeklyGoal(goal.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right tips card */}
            <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(79,184,168,0.03) 0%, rgba(3,105,161,0.03) 100%)', border: '1px solid rgba(79,184,168,0.08)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-teal)' }}>
                <Zap size={14} /> Weekly Focus Guidelines
              </h4>
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-app-muted)', lineHeight: 1.6 }}>
                Weekly focus objectives represent high-level milestones or epics that you aim to finish by Friday. Unlike daily schedules, weekly goals represent general targets:
              </p>
              <ul style={{ paddingLeft: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-app-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>🚀 <strong>Epic deliverables</strong>: e.g. Deploy auth modules.</li>
                <li>🎯 <strong>Milestones</strong>: e.g. Close 5 high-priority bugs.</li>
                <li>🛠️ <strong>Maintenance</strong>: e.g. Complete code comments and documentation stubs.</li>
              </ul>
            </div>
          </div>
        )}

        {/* 3. TIMELINES & DEADLINES TAB */}
        {activeTab === 'timeline' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            {/* Left timeline layout */}
            <div className="card" style={{ padding: 24, minHeight: 400 }}>
              <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: '800', color: 'var(--color-app-text)' }}>
                Active Project Sprint Timelines
              </h3>

              {isLoadingProjects ? (
                <LoadingSpinner size={30} />
              ) : projects.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={44} style={{ color: 'var(--color-app-muted)' }} />}
                  title="No Active Projects"
                  description="Sprint timelines visualizer maps deadlines dynamically. Create a project to view its timeline."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {projects.map(proj => {
                    const startLabel = proj.startDate ? new Date(proj.startDate).toLocaleDateString() : 'N/A'
                    const deadlineLabel = proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'N/A'
                    
                    // Simple progress calculation based on date range
                    let progressPct = 0
                    if (proj.startDate && proj.deadline) {
                      const total = new Date(proj.deadline) - new Date(proj.startDate)
                      const spent = new Date() - new Date(proj.startDate)
                      progressPct = Math.min(100, Math.max(0, Math.ceil((spent / total) * 100)))
                    }

                    return (
                      <div key={proj.id} style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderRadius: '10px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '16px' }}>{proj.icon || '📁'}</span>
                            <span style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>
                              {proj.name}
                            </span>
                          </div>

                          <span style={{
                            fontSize: '9.5px', fontWeight: 'bold', textTransform: 'uppercase',
                            color: proj.status === 'completed' ? 'var(--color-teal)' : 'var(--color-amber)',
                            background: proj.status === 'completed' ? 'rgba(79, 184, 168, 0.1)' : 'rgba(232, 163, 61, 0.1)',
                            padding: '2px 8px', borderRadius: '4px'
                          }}>
                            {proj.status}
                          </span>
                        </div>

                        {/* Progress Bar Timeline */}
                        <div style={{ height: '6px', background: 'var(--color-app-bg)', borderRadius: '3px', overflow: 'hidden', marginBottom: 12 }}>
                          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-teal), #0ea5e9)', borderRadius: '3px' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-app-muted)' }}>
                          <span>Start: <strong>{startLabel}</strong></span>
                          <span>Duration: <strong>{progressPct}% elapsed</strong></span>
                          <span>Deadline: <strong>{deadlineLabel}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right sidebar deadline list */}
            <div className="card" style={{ padding: 20, background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '13.5px', fontWeight: '800', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> Deadline Reminders
              </h4>

              {deadlineAlerts.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--color-app-faint)', margin: 0, textAlign: 'center', padding: '16px 0' }}>
                  No imminent task or project deadlines in the next 7 days. Excellent!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {deadlineAlerts.map((alertItem, idx) => {
                    const isOverdue = alertItem.daysLeft < 0
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'var(--color-app-bg)',
                          border: isOverdue ? '1px solid var(--color-danger)' : '1px solid var(--color-app-border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
                            {alertItem.title}
                          </span>
                          
                          <span style={{
                            fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase',
                            color: alertItem.type === 'task' ? 'var(--color-teal)' : 'var(--color-violet-bright)'
                          }}>
                            {alertItem.type}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-app-muted)' }}>
                          <span style={{ color: isOverdue ? 'var(--color-danger)' : 'var(--color-amber)', fontWeight: 'bold' }}>
                            {isOverdue ? 'Overdue!' : `${alertItem.daysLeft} days left`}
                          </span>
                          <span>{new Date(alertItem.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI PLANNER RECOMMENDATIONS CONFIRMATION MODAL */}
      {showAIModal && (
        <div className="auth-overlay" role="presentation" onMouseDown={() => setShowAIModal(false)}>
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 500, width: '95%' }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} style={{ color: 'var(--color-amber)' }} />
              <span>Recommended AI Daily Plan</span>
            </h3>
            <p className="auth-subtitle" style={{ marginBottom: 16 }}>
              The AI Co-pilot analyzed your current backlog tasks and suggested these time blocks to organize your day.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {aiRecommendations.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 12px',
                    background: 'var(--color-app-bg)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--color-app-text)' }}>{rec.title}</p>
                    <span style={{ fontSize: '10px', color: 'var(--color-app-faint)' }}>Type: {rec.type}</span>
                  </div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-app-muted)' }}>
                    {rec.startTime} - {rec.endTime}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="app-btn" onClick={() => setShowAIModal(false)}>Cancel</button>
              <button className="app-btn primary" onClick={handleApplyAISchedule}>
                Apply to Daily Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
