import { useState } from 'react'
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import { useTasks } from './hooks/useTasks'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { PRIORITY_ORDER } from '@/shared/constants/priorities'
import { STATUS_ORDER, TASK_STATUSES } from '@/shared/constants/taskStatuses'

const PRIORITY_LABELS = { none: 'None', low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' }

export default function TasksPage() {
  // Server-side filters
  const [filterStatus,   setFilterStatus]   = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterProject,  setFilterProject]  = useState('')
  // Client-side search
  const [search, setSearch] = useState('')

  const serverFilters = {}
  if (filterStatus)   serverFilters.status   = filterStatus
  if (filterPriority) serverFilters.priority = filterPriority
  if (filterProject)  serverFilters.project  = filterProject

  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  } = useTasks(serverFilters)

  const { projects } = useProjects()

  const [formOpen,      setFormOpen]      = useState(false)
  const [editingTask,   setEditingTask]   = useState(null)
  const [isSubmitting,  setIsSubmitting]  = useState(false)

  const visibleTasks = search.trim()
    ? tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    : tasks

  const hasFilters = filterStatus || filterPriority || filterProject

  const clearFilters = () => {
    setFilterStatus('')
    setFilterPriority('')
    setFilterProject('')
    setSearch('')
  }

  const handleOpenCreate = () => { setEditingTask(null); setFormOpen(true) }
  const handleOpenEdit   = (task) => { setEditingTask(task); setFormOpen(true) }
  const handleClose      = () => { setFormOpen(false); setEditingTask(null) }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...data })
      } else {
        await createTask(data)
      }
      handleClose()
    } catch (err) {
      alert(err.message || 'Failed to save task.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try { await deleteTask(id) }
    catch (err) { alert(err.message || 'Failed to delete.') }
  }

  const handleComplete = async (id) => {
    try { await completeTask(id) }
    catch (err) { alert(err.message || 'Failed to complete.') }
  }

  const handleAddSubtask = async (taskId, title) => {
    try { await addSubtask({ taskId, title }) }
    catch (err) { alert(err.message || 'Failed to add subtask.') }
  }

  const handleToggleSubtask = async (taskId, subId, done) => {
    try { await updateSubtask({ taskId, subId, done }) }
    catch (err) { alert(err.message || 'Failed to update subtask.') }
  }

  const handleDeleteSubtask = async (taskId, subId) => {
    try { await deleteSubtask({ taskId, subId }) }
    catch (err) { alert(err.message || 'Failed to delete subtask.') }
  }

  const selectStyle = {
    padding: '8px 12px',
    background: 'var(--color-app-surface)',
    border: '1px solid var(--color-app-border)',
    borderRadius: 8,
    color: 'var(--color-app-text)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader
        title="Tasks"
        subtitle="Track, prioritise, and complete your development work."
        action={
          <button className="app-btn primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            <span>New Task</span>
          </button>
        }
      />

      {/* Filter + Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 180,
            padding: '8px 12px',
            background: 'var(--color-app-surface)',
            border: '1px solid var(--color-app-border)',
            borderRadius: 8,
          }}
        >
          <Search size={14} style={{ color: 'var(--color-app-faint)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--color-app-text)',
              fontSize: 13,
              flex: 1,
            }}
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={selectStyle}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{TASK_STATUSES[s]?.label ?? s}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          style={selectStyle}
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          {PRIORITY_ORDER.map((p) => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>

        {/* Project filter */}
        {projects.length > 0 && (
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            style={selectStyle}
            aria-label="Filter by project"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
            ))}
          </select>
        )}

        {/* Clear filters */}
        {(hasFilters || search) && (
          <button
            className="df-sugg-dismiss"
            onClick={clearFilters}
            style={{ padding: '8px 10px', color: 'var(--color-amber)', border: '1px solid var(--color-amber)', borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <X size={13} /> Clear
          </button>
        )}

        {/* Active filter count indicator */}
        {(hasFilters || search) && (
          <span style={{ fontSize: 12, color: 'var(--color-app-faint)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <SlidersHorizontal size={13} />
            {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''} shown
          </span>
        )}
      </div>

      {/* Task List */}
      <TaskList
        tasks={visibleTasks}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onCreateClick={handleOpenCreate}
      />

      {/* Create / Edit form */}
      {formOpen && (
        <TaskForm
          task={editingTask}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
