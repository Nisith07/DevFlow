import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Plus, Send, Trash2, Sparkles,
  Calendar, Layers, CheckSquare, AlertCircle, BarChart2, CornerDownLeft, LoaderCircle
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import {
  useAIConversations,
  useAIConversation,
  useCreateAIConversation,
  useDeleteAIConversation,
  useSendAIMessage
} from './hooks/useAI.js'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const SUGGESTIONS = [
  { id: 'plan',      icon: Calendar,    text: 'Plan my week',         sub: 'Generate a logical Mon-Fri schedule' },
  { id: 'break',     icon: Layers,      text: 'Break project into subtasks', sub: 'Suggest subtasks for linked tasks' },
  { id: 'summary',   icon: CheckSquare, text: 'Summarize today\'s progress', sub: 'Report on achievements and blocker status' },
  { id: 'priorities',icon: AlertCircle, text: 'Suggest task priorities', sub: 'Identify critical deadlines' },
  { id: 'report',    icon: BarChart2,   text: 'Generate weekly reports', sub: 'Get analytical performance insights' },
  { id: 'create',    icon: Sparkles,    text: 'Create tasks from natural language', sub: 'e.g. "Add a high priority bug fix task due tomorrow"' },
]

export default function AIAssistantPage() {
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)

  const { data: sessions = [], isLoading: isLoadingSessions } = useAIConversations()
  const { data: activeSession, isLoading: isLoadingActiveSession } = useAIConversation(activeSessionId)

  const createSession = useCreateAIConversation()
  const deleteSession = useDeleteAIConversation()
  const sendMessage   = useSendAIMessage()

  const feedEndRef = useRef(null)

  // Scroll to bottom of message feed
  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages?.length, activeSessionId])

  const handleStartNewSession = async (initialText = null) => {
    try {
      const fresh = await createSession.mutateAsync(initialText ? initialText.slice(0, 30) : 'New Chat Session')
      setActiveSessionId(fresh.id)
      if (initialText) {
        setSending(true)
        await sendMessage.mutateAsync({ conversationId: fresh.id, text: initialText })
        setSending(false)
      }
    } catch (err) {
      alert(err.message || 'Failed to start chat session.')
      setSending(false)
    }
  }

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    setInputText('')
    setSending(true)
    try {
      let targetId = activeSessionId
      if (!targetId) {
        const fresh = await createSession.mutateAsync(text.slice(0, 30))
        targetId = fresh.id
        setActiveSessionId(fresh.id)
      }
      await sendMessage.mutateAsync({ conversationId: targetId, text })
    } catch (err) {
      alert(err.message || 'Failed to send message.')
    } finally {
      setSending(false)
    }
  }

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this conversation history?')) return
    try {
      await deleteSession.mutateAsync(id)
      if (activeSessionId === id) setActiveSessionId(null)
    } catch (err) {
      alert(err.message || 'Failed to delete conversation.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format message rendering with markdown-style line breaks and simple formatting
  const renderMessageText = (text) => {
    return text.split('\n').map((line, index) => {
      // Highlight bold text
      let parts = [line]
      const boldRegex = /\*\*(.*?)\*\*/g
      if (boldRegex.test(line)) {
        parts = []
        let lastIdx = 0
        let match
        boldRegex.lastIndex = 0
        while ((match = boldRegex.exec(line)) !== null) {
          parts.push(line.substring(lastIdx, match.index))
          parts.push(<strong key={match.index} style={{ color: 'var(--color-teal)' }}>{match[1]}</strong>)
          lastIdx = boldRegex.lastIndex
        }
        parts.push(line.substring(lastIdx))
      }

      return (
        <span key={index} style={{ display: 'block', minHeight: line === '' ? 12 : 'auto' }}>
          {parts}
        </span>
      )
    })
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ paddingBottom: 16 }}>
        <PageHeader
          title="AI Copilot"
          subtitle="Your contextual productivity assistant linked directly to your tasks, projects, and due dates."
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--color-app-border)',
          borderRadius: 12,
          background: 'var(--color-app-bg)',
          overflow: 'hidden',
        }}
      >
        {/* Left Sidebar: Conversations history */}
        <div
          style={{
            borderRight: '1px solid var(--color-app-border)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div style={{ padding: 12, borderBottom: '1px solid var(--color-app-border)' }}>
            <button
              className="app-btn primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => handleStartNewSession()}
            >
              <Plus size={16} />
              <span>New Chat</span>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 6px' }}>
            {isLoadingSessions ? (
              <LoadingSpinner size={24} />
            ) : sessions.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: 12, padding: '24px 0' }}>
                No past sessions.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => setActiveSessionId(sess.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: activeSessionId === sess.id ? 'var(--color-app-surface)' : 'transparent',
                      border: activeSessionId === sess.id ? '1px solid var(--color-app-border)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (activeSessionId !== sess.id) e.currentTarget.style.background = 'var(--color-app-surface-hover)'
                    }}
                    onMouseLeave={(e) => {
                      if (activeSessionId !== sess.id) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <MessageSquare size={14} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: activeSessionId === sess.id ? 600 : 400,
                        color: activeSessionId === sess.id ? 'var(--color-app-text)' : 'var(--color-app-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {sess.title}
                    </span>
                    <button
                      className="df-sugg-dismiss"
                      style={{ padding: 2, color: 'var(--color-danger)' }}
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Active conversation feed */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {activeSessionId && isLoadingActiveSession ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LoadingSpinner size={40} />
            </div>
          ) : activeSession ? (
            <>
              {/* Session Header */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--color-app-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--color-app-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={15} style={{ color: 'var(--color-amber)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-app-text)' }}>
                    {activeSession.title}
                  </span>
                </div>
              </div>

              {/* Chat Feed */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activeSession.messages.length === 0 ? (
                  <EmptyState
                    icon={<Sparkles size={48} style={{ color: 'var(--color-amber)' }} />}
                    title="DevFlow AI Co-Pilot Ready"
                    description="Send a message or select a shortcut capability below to get contextual advice using your real workspace tasks and projects."
                  />
                ) : (
                  activeSession.messages.map((msg, index) => {
                    const isAssistant = msg.sender === 'assistant'
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                          width: '100%',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '12px 16px',
                            borderRadius: 12,
                            fontSize: 13,
                            lineHeight: 1.6,
                            background: isAssistant ? 'var(--color-app-surface)' : 'var(--color-teal)',
                            border: isAssistant ? '1px solid var(--color-app-border)' : '1px solid transparent',
                            color: isAssistant ? 'var(--color-app-text)' : '#FFFFFF',
                          }}
                        >
                          {renderMessageText(msg.text)}
                        </div>
                      </div>
                    )
                  })
                )}
                {sending && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: 'var(--color-app-surface)',
                        border: '1px solid var(--color-app-border)',
                        color: 'var(--color-app-muted)',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <LoaderCircle size={14} className="auth-spinner" style={{ color: 'var(--color-amber)' }} />
                      <span>AI Copilot is processing context and thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={feedEndRef} />
              </div>
            </>
          ) : (
            /* Welcome / shortcuts panel when no conversation is active */
            <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(245,158,11,0.1)',
                    marginBottom: 16,
                  }}
                >
                  <Sparkles size={28} style={{ color: 'var(--color-amber)' }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-app-text)', margin: 0 }}>
                  Ask DevFlow AI Assistant
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-app-muted)', marginTop: 6 }}>
                  Choose one of the specialized copilot capabilities below to generate plan configurations, priorities, reports, or tasks instantly.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                  maxWidth: 680,
                  margin: '0 auto',
                  width: '100%',
                }}
              >
                {SUGGESTIONS.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleStartNewSession(item.text)}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        background: 'var(--color-app-bg)',
                        border: '1px solid var(--color-app-border)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s, border-color 0.15s',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-app-surface)'
                        e.currentTarget.style.borderColor = 'var(--color-teal)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-app-bg)'
                        e.currentTarget.style.borderColor = 'var(--color-app-border)'
                      }}
                    >
                      <Icon size={18} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--color-app-text)' }}>
                          {item.text}
                        </p>
                        <p style={{ margin: '3px 0 0', fontSize: 11, color: 'var(--color-app-muted)', lineHeight: 1.4 }}>
                          {item.sub}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chat Input row */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--color-app-border)',
              background: 'var(--color-app-surface)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 10, position: 'relative', alignItems: 'flex-end' }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask assistant to plan, prioritize, create tasks, or summarize..."
                rows={1}
                disabled={sending}
                style={{
                  flex: 1,
                  padding: '10px 12px 10px 12px',
                  background: 'var(--color-app-bg)',
                  border: '1px solid var(--color-app-border)',
                  borderRadius: 10,
                  color: 'var(--color-app-text)',
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: 'none',
                  outline: 'none',
                  maxHeight: 120,
                  fontFamily: 'inherit',
                }}
              />
              <button
                className="app-btn primary"
                onClick={() => handleSendMessage()}
                disabled={sending || !inputText.trim()}
                style={{
                  height: 38,
                  padding: '0 16px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Send size={14} />
                <CornerDownLeft size={10} style={{ opacity: 0.6 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
