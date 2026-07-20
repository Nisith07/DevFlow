import { useState } from 'react'
import { ChevronLeft, ChevronRight, Milestone } from 'lucide-react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function CalendarView({ tasks, onEdit }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1)
  const startDayOfWeek = firstDayOfMonth.getDay()

  // Days in current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

  // Days in previous month
  const prevMonthDays = new Date(year, month, 0).getDate()

  const daysGrid = []

  // Add padding days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    daysGrid.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false,
    })
  }

  // Add days of current month
  for (let i = 1; i <= totalDaysInMonth; i++) {
    daysGrid.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true,
    })
  }

  // Add padding days from next month to complete 6 rows (42 blocks)
  const totalSlots = 42
  const nextMonthPadding = totalSlots - daysGrid.length
  for (let i = 1; i <= nextMonthPadding; i++) {
    daysGrid.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false,
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getTasksForDate = (dayObj) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      const d = new Date(task.dueDate)
      // Check date matches UTC or local depending on parsing
      // Mongoose saves dates in UTC. We check local calendar day matches task dueDate
      return d.getFullYear() === dayObj.year &&
             d.getMonth() === dayObj.month &&
             d.getDate() === dayObj.day
    })
  }

  const isToday = (dayObj) => {
    const today = new Date()
    return today.getFullYear() === dayObj.year &&
           today.getMonth() === dayObj.month &&
           today.getDate() === dayObj.day
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-app-surface)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--color-app-border)' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--color-app-text)' }}>
          {MONTHS[month]} {year}
        </h3>
        
        <div style={{ display: 'flex', gap: 6 }}>
          <button 
            onClick={handlePrevMonth} 
            className="df-sugg-dismiss" 
            style={{ padding: '6px', border: '1px solid var(--color-app-border)', borderRadius: '6px', background: 'var(--color-app-bg)', display: 'flex', alignItems: 'center' }}
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date())} 
            className="app-btn" 
            style={{ height: '30px', padding: '0 12px', fontSize: '12px', borderRadius: '6px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', color: 'var(--color-app-text)' }}
          >
            Today
          </button>
          <button 
            onClick={handleNextMonth} 
            className="df-sugg-dismiss" 
            style={{ padding: '6px', border: '1px solid var(--color-app-border)', borderRadius: '6px', background: 'var(--color-app-bg)', display: 'flex', alignItems: 'center' }}
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          background: 'var(--color-app-surface)', 
          border: '1px solid var(--color-app-border)', 
          borderRadius: '16px', 
          overflow: 'hidden',
          minHeight: '480px'
        }}
      >
        {/* Grid Header (Weekday Names) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--color-app-border)', background: 'rgba(255,255,255,0.01)' }}>
          {WEEKDAYS.map((day) => (
            <div 
              key={day} 
              style={{ 
                padding: '10px 0', 
                textAlign: 'center', 
                fontSize: '11px', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: 'var(--color-app-muted)' 
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', flex: 1 }}>
          {daysGrid.map((dayObj, index) => {
            const dateTasks = getTasksForDate(dayObj)
            const current = dayObj.isCurrentMonth
            const today = isToday(dayObj)

            return (
              <div
                key={index}
                style={{
                  padding: '8px',
                  borderRight: (index + 1) % 7 !== 0 ? '1px solid var(--color-app-border)' : 'none',
                  borderBottom: index < 35 ? '1px solid var(--color-app-border)' : 'none',
                  background: today 
                    ? 'rgba(79, 184, 168, 0.03)' 
                    : current 
                    ? 'transparent' 
                    : 'rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minHeight: '75px',
                  position: 'relative'
                }}
              >
                {/* Date number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: today ? '800' : '600', 
                      color: today 
                        ? 'var(--color-teal)' 
                        : current 
                        ? 'var(--color-app-text)' 
                        : 'var(--color-app-faint)',
                      background: today ? 'rgba(79, 184, 168, 0.15)' : 'transparent',
                      padding: today ? '2px 6px' : '0',
                      borderRadius: today ? '4px' : '0'
                    }}
                  >
                    {dayObj.day}
                  </span>
                </div>

                {/* Date Tasks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto', flex: 1, maxHeight: '65px', paddingRight: '2px' }}>
                  {dateTasks.slice(0, 3).map((task) => {
                    const isDone = task.status === 'done'
                    return (
                      <div
                        key={task.id}
                        onClick={() => onEdit(task)}
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '600',
                          padding: '3px 6px',
                          borderRadius: '4px',
                          background: isDone 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : 'rgba(255, 255, 255, 0.04)',
                          borderLeft: `3.5px solid ${isDone ? 'var(--color-app-faint)' : 'var(--color-violet)'}`,
                          color: isDone ? 'var(--color-app-faint)' : 'var(--color-app-text)',
                          textDecoration: isDone ? 'line-through' : 'none',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = isDone ? 'rgba(255,255,255,0.02)' : 'rgba(255, 255, 255, 0.04)'}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    )
                  })}
                  {dateTasks.length > 3 && (
                    <div style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-app-faint)', paddingLeft: '4px' }}>
                      +{dateTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
