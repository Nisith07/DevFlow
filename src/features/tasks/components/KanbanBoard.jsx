import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Calendar, CheckCircle2, Clock, MoreVertical, Plus } from 'lucide-react'
import { STATUS_ORDER, TASK_STATUSES } from '@/shared/constants/taskStatuses'
import { PRIORITIES } from '@/shared/constants/priorities'
import { useReorderTasks } from '../hooks/useTasks'

export default function KanbanBoard({ tasks, onEdit, onCreateClick }) {
  const [columns, setColumns] = useState({})
  const { mutateAsync: reorderTasks } = useReorderTasks()

  useEffect(() => {
    // Group tasks into columns
    const initialCols = STATUS_ORDER.reduce((acc, status) => {
      acc[status] = tasks
        .filter(t => t.status === status)
        .sort((a, b) => (a.boardPosition || 0) - (b.boardPosition || 0))
      return acc
    }, {})
    setColumns(initialCols)
  }, [tasks])

  const handleDragEnd = async (result) => {
    const { source, destination } = result

    // Dropped outside a valid column
    if (!destination) return

    // Dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    const sourceStatus = source.droppableId
    const destStatus = destination.droppableId

    const sourceCol = [...columns[sourceStatus]]
    const destCol = sourceStatus === destStatus ? sourceCol : [...columns[destStatus]]

    const [movedTask] = sourceCol.splice(source.index, 1)

    // Update status locally if column changed
    if (sourceStatus !== destStatus) {
      movedTask.status = destStatus
    }

    destCol.splice(destination.index, 0, movedTask)

    // Optimistic UI update
    setColumns(prev => ({
      ...prev,
      [sourceStatus]: sourceCol,
      [destStatus]: destCol
    }))

    // Prepare batch update payload based on new order in the destination column
    const updates = destCol.map((task, index) => ({
      id: task.id,
      status: task.status,
      boardPosition: index
    }))

    try {
      await reorderTasks(updates)
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
      // The query invalidation in onSuccess/onError handles syncing real state back
    }
  }

  const getPriorityColor = (p) => PRIORITIES[p]?.color || 'var(--color-app-faint)'

  return (
    <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 10, minHeight: 'calc(100vh - 250px)' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {STATUS_ORDER.map(status => {
          const statusDef = TASK_STATUSES[status]
          const colTasks = columns[status] || []
          
          return (
            <div key={status} style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--color-app-bg)', padding: '12px', borderRadius: 12, border: '1px solid var(--color-app-border)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusDef?.color || '#fff' }} />
                  <span style={{ fontSize: 13, fontWeight: '700', color: 'var(--color-app-text)' }}>{statusDef?.label || status}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-app-faint)', background: 'var(--color-app-surface)', padding: '2px 6px', borderRadius: 10 }}>{colTasks.length}</span>
                </div>
                <button 
                  onClick={() => onCreateClick(status)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-app-faint)', cursor: 'pointer', padding: 4, borderRadius: 4 }}
                >
                  <Plus size={14} />
                </button>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      minHeight: 100,
                      backgroundColor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderRadius: 8,
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onEdit(task)}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: 'var(--color-app-surface)',
                              border: '1px solid var(--color-app-border)',
                              borderRadius: 8,
                              padding: 12,
                              cursor: 'pointer',
                              boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.4)' : 'none',
                              opacity: snapshot.isDragging ? 0.9 : 1,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: 13, fontWeight: '500', color: 'var(--color-app-text)', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                                {task.title}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {task.priority && task.priority !== 'none' && (
                                <span style={{ fontSize: 10, color: getPriorityColor(task.priority), border: `1px solid ${getPriorityColor(task.priority)}40`, padding: '2px 6px', borderRadius: 4 }}>
                                  {task.priority.toUpperCase()}
                                </span>
                              )}
                              
                              {task.aiEstimate && (
                                <span style={{ fontSize: 10, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                                  <Clock size={10} /> {task.aiEstimate}
                                </span>
                              )}

                              {task.subtasks?.length > 0 && (
                                <span style={{ fontSize: 10, color: 'var(--color-app-faint)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <CheckCircle2 size={10} /> {task.subtasks.filter(s => s.done).length}/{task.subtasks.length}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

            </div>
          )
        })}
      </DragDropContext>
    </div>
  )
}
