import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare, Plus, Send, Trash2, Sparkles,
  Calendar, Layers, CheckSquare, AlertCircle, BarChart2, CornerDownLeft, LoaderCircle,
  Code, Star, BookOpen, Database, Cpu, GitCommit, Copy, Eye, FileText, ChevronRight, Bookmark
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import {
  useAIConversations,
  useAIConversation,
  useCreateAIConversation,
  useDeleteAIConversation,
  useSendAIMessage,
  useAICopilotHistory,
  useRunCopilotTool,
  useUpdateCopilotHistory,
  useDeleteCopilotHistory
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

const DEVELOPER_TOOLS = [
  { id: 'explain_code', label: 'Explain Code', icon: BookOpen, desc: 'Analyze and explain logic in clear markdown.', placeholder: 'Paste the code snippet you want explained...' },
  { id: 'generate_code', label: 'Generate Code', icon: Code, desc: 'Create code blocks from functional requirements.', placeholder: 'Describe the feature, stack, and functionality you want to build...' },
  { id: 'debug_error', label: 'Debug Error', icon: Cpu, desc: 'Find errors, trace stack traces and suggest fixes.', placeholder: 'Paste the stack trace/error logs along with context code...' },
  { id: 'optimize_code', label: 'Optimize Code', icon: Sparkles, desc: 'Refactor code to improve performance and footprint.', placeholder: 'Paste the source code you want optimized...' },
  { id: 'generate_readme', label: 'Generate README', icon: FileText, desc: 'Author documentation or repository READMEs.', placeholder: 'Describe your module, package, setup instructions, and parameters...' },
  { id: 'generate_api', label: 'Generate API', icon: Layers, desc: 'Create REST endpoints and controller stubs.', placeholder: 'Describe the database model, routes, and required controllers...' },
  { id: 'write_commit', label: 'Write Commit Message', icon: GitCommit, desc: 'Author messages matching conventional specifications.', placeholder: 'Paste the git diff or describe the code changes made...' },
  { id: 'review_code', label: 'Review Code', icon: Eye, desc: 'Audit for vulnerabilities and anti-patterns.', placeholder: 'Paste the code snippet you want peer reviewed...' },
  { id: 'sql_generator', label: 'SQL Generator', icon: Database, desc: 'Create SQL statements, joins, and tables.', placeholder: 'Describe the database structure, tables, and query you need...' },
  { id: 'regex_generator', label: 'Regex Generator', icon: Search, desc: 'Generate matching patterns with tutorials.', placeholder: 'Describe the string matching pattern you need regex to capture...' },
  { id: 'doc_generator', label: 'Documentation Gen', icon: FileText, desc: 'Write JSDocs, Docstrings, and manuals.', placeholder: 'Paste the code you want documented with explanations...' },
]

// Stand-in Search icon
function Search({ size, style }) {
  return (
    <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat') // chat, copilot

  // 1. CHAT WORKSPACE STATE
  const [activeSessionId, setActiveSessionId] = useState(null)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)

  const { data: sessions = [], isLoading: isLoadingSessions } = useAIConversations()
  const { data: activeSession, isLoading: isLoadingActiveSession } = useAIConversation(activeSessionId)

  const createSession = useCreateAIConversation()
  const deleteSession = useDeleteAIConversation()
  const sendMessage   = useSendAIMessage()

  const feedEndRef = useRef(null)

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

  const renderMessageText = (text) => {
    return text.split('\n').map((line, index) => {
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

  // 2. DEVELOPER COPILOT TOOLS STATE
  const [selectedToolId, setSelectedToolId] = useState('explain_code')
  const [toolPrompt, setToolPrompt] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  const activeTool = DEVELOPER_TOOLS.find(t => t.id === selectedToolId) || DEVELOPER_TOOLS[0]

  // Query / Mutation hooks for copilot runs
  const { data: copilotHistory = [], isLoading: isLoadingHistory } = useAICopilotHistory({
    capability: selectedToolId,
    favorite: showFavoritesOnly ? true : undefined
  })
  
  const runCopilot = useRunCopilotTool()
  const toggleFavorite = useUpdateCopilotHistory()
  const deleteHistory = useDeleteCopilotHistory()

  const handleRunTool = async (e) => {
    e.preventDefault()
    if (!toolPrompt.trim()) return
    try {
      const res = await runCopilot.mutateAsync({
        capability: selectedToolId,
        prompt: toolPrompt
      })
      setSelectedHistoryItem(res)
      setToolPrompt('')
    } catch (err) {
      alert('Failed to execute AI request.')
    }
  }

  const handleToggleFav = async (item, e) => {
    e.stopPropagation()
    try {
      const updated = await toggleFavorite.mutateAsync({ id: item.id, isFavorite: !item.isFavorite })
      if (selectedHistoryItem?.id === item.id) {
        setSelectedHistoryItem(updated)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this history run?')) return
    try {
      await deleteHistory.mutateAsync(id)
      if (selectedHistoryItem?.id === id) setSelectedHistoryItem(null)
    } catch (err) {
      console.error(err)
    }
  }

  // Visualizer renderer for markdown output
  const renderResponseMarkdown = (text) => {
    if (!text) return null
    const blocks = text.split(/(```[\s\S]*?```)/g)
    return blocks.map((block, i) => {
      if (block.startsWith('```')) {
        const codeText = block.replace(/```[a-zA-Z]*\n/, '').replace(/```$/, '')
        return (
          <div key={i} style={{ position: 'relative', margin: '14px 0', background: '#090e1a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Generated Snippet</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(codeText)
                  alert('Copied to clipboard!')
                }} 
                style={{ background: 'none', border: 'none', color: 'var(--color-teal)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}
              >
                <Copy size={11} /> Copy Code
              </button>
            </div>
            <pre style={{ margin: 0, padding: '14px', overflowX: 'auto', fontSize: '12.5px', fontFamily: 'monospace', color: '#38bdf8', lineHeight: 1.5 }}>
              <code>{codeText}</code>
            </pre>
          </div>
        )
      }

      return (
        <div key={i} style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-app-text)' }}>
          {block.split('\n').map((line, j) => {
            if (line.startsWith('### ')) {
              return <h4 key={j} style={{ color: 'var(--color-app-text)', marginTop: '16px', marginBottom: '8px', fontWeight: '700' }}>{line.slice(4)}</h4>
            }
            if (line.startsWith('## ')) {
              return <h3 key={j} style={{ color: 'var(--color-teal)', marginTop: '20px', marginBottom: '10px', fontWeight: '800' }}>{line.slice(3)}</h3>
            }
            if (line.startsWith('# ')) {
              return <h2 key={j} style={{ color: 'var(--color-teal)', marginTop: '24px', marginBottom: '12px', fontWeight: '800' }}>{line.slice(2)}</h2>
            }
            if (line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <li key={j} style={{ marginLeft: '14px', marginBottom: '4px', listStyleType: 'disc' }}>
                  {renderLineText(line.slice(2))}
                </li>
              )
            }
            return <p key={j} style={{ margin: '0 0 10px 0', minHeight: line === '' ? 12 : 'auto' }}>{renderLineText(line)}</p>
          })}
        </div>
      )
    })
  }

  const renderLineText = (line) => {
    let parts = [line]
    const boldRegex = /\*\*(.*?)\*\*/g
    if (boldRegex.test(line)) {
      parts = []
      let lastIdx = 0
      let match
      boldRegex.lastIndex = 0
      while ((match = boldRegex.exec(line)) !== null) {
        parts.push(line.substring(lastIdx, match.index))
        parts.push(<strong key={match.index} style={{ color: 'var(--color-teal)', fontWeight: '700' }}>{match[1]}</strong>)
        lastIdx = boldRegex.lastIndex
      }
      parts.push(line.substring(lastIdx))
    }
    return parts
  }

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
      {/* Top Header & Tab switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <PageHeader
          title="AI Assistant"
          subtitle="Linked directly to your tasks, projects, and codebase context."
        />

        {/* Tab Selection */}
        <div style={{ display: 'flex', background: 'var(--color-app-surface)', borderRadius: 8, padding: 4, border: '1px solid var(--color-app-border)' }}>
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: activeTab === 'chat' ? 'var(--color-app-bg)' : 'transparent',
              color: activeTab === 'chat' ? '#fff' : 'var(--color-app-faint)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            <MessageSquare size={13} />
            <span>Workspace Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              background: activeTab === 'copilot' ? 'var(--color-app-bg)' : 'transparent',
              color: activeTab === 'copilot' ? '#fff' : 'var(--color-app-faint)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '12.5px',
              fontWeight: '600'
            }}
          >
            <Code size={13} />
            <span>Developer Copilot</span>
          </button>
        </div>
      </div>

      {/* Grid Content Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '290px 1fr',
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--color-app-border)',
          borderRadius: 14,
          background: 'var(--color-app-bg)',
          overflow: 'hidden',
        }}
      >
        {/* TAB 1: WORKSPACE CHAT PANEL */}
        {activeTab === 'chat' ? (
          <>
            {/* Left Sidebar: Conversations history */}
            <div style={{ borderRight: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
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
          </>
        ) : (
          /* TAB 2: DEVELOPER COPILOT TOOLS PANEL */
          <>
            {/* Left Sidebar: Tool select and history log */}
            <div style={{ borderRight: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Tool Selection select */}
              <div style={{ padding: '12px', borderBottom: '1px solid var(--color-app-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Copilot Tool</span>
                <select
                  value={selectedToolId}
                  onChange={(e) => {
                    setSelectedToolId(e.target.value)
                    setSelectedHistoryItem(null)
                  }}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--color-app-surface)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '8px',
                    color: 'var(--color-app-text)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    outline: 'none',
                    fontWeight: '600'
                  }}
                >
                  {DEVELOPER_TOOLS.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* History Toolbar (favorite filter) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--color-app-muted)' }}>Saved Runs</span>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: showFavoritesOnly ? 'var(--color-amber)' : 'var(--color-app-faint)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  <Star size={10} fill={showFavoritesOnly ? 'var(--color-amber)' : 'none'} />
                  <span>Favs Only</span>
                </button>
              </div>

              {/* History scroll view */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                {isLoadingHistory ? (
                  <LoadingSpinner size={20} />
                ) : copilotHistory.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--color-app-faint)', fontSize: 11, padding: '24px 8px' }}>
                    No runs found.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {copilotHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHistoryItem(item)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: selectedHistoryItem?.id === item.id ? 'var(--color-app-surface)' : 'transparent',
                          border: selectedHistoryItem?.id === item.id ? '1px solid var(--color-app-border)' : '1px solid transparent',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
                            {item.prompt.trim().slice(0, 24)}...
                          </span>
                          
                          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                            <button
                              onClick={(e) => handleToggleFav(item, e)}
                              style={{ background: 'none', border: 'none', color: item.isFavorite ? 'var(--color-amber)' : 'var(--color-app-faint)', padding: '2px', cursor: 'pointer' }}
                            >
                              <Star size={11} fill={item.isFavorite ? 'var(--color-amber)' : 'none'} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteHistory(item.id, e)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-danger)', padding: '2px', cursor: 'pointer' }}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--color-app-faint)' }}>
                          <span>{formatDateLabel(item.createdAt)}</span>
                          <span>{item.tokens || 0} tokens</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Interactive output visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflowY: 'auto', padding: '24px' }}>
              {/* Active Tool Header */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', borderBottom: '1px solid var(--color-app-border)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79, 184, 168, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal)' }}>
                  {activeTool && <activeTool.icon size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-app-text)' }}>{activeTool.label}</h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--color-app-muted)' }}>{activeTool.desc}</p>
                </div>
              </div>

              {/* Editor input block */}
              <form onSubmit={handleRunTool} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Prompt / Code Editor</span>
                <textarea
                  value={toolPrompt}
                  onChange={(e) => setToolPrompt(e.target.value)}
                  placeholder={activeTool.placeholder}
                  rows={6}
                  style={{
                    padding: '12px',
                    background: 'var(--color-app-surface)',
                    border: '1px solid var(--color-app-border)',
                    borderRadius: '10px',
                    color: 'var(--color-app-text)',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
                
                <button
                  type="submit"
                  className="app-btn primary"
                  disabled={runCopilot.isPending || !toolPrompt.trim()}
                  style={{
                    alignSelf: 'flex-end',
                    padding: '0 20px',
                    height: '38px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {runCopilot.isPending ? (
                    <>
                      <LoaderCircle size={14} className="auth-spinner" />
                      <span>Thinking...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Run Tool</span>
                    </>
                  )}
                </button>
              </form>

              {/* Display Result visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Response Output</span>
                  
                  {selectedHistoryItem && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--color-app-faint)' }}>{selectedHistoryItem.tokens || 0} tokens used</span>
                      <button
                        onClick={(e) => handleToggleFav(selectedHistoryItem, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: selectedHistoryItem.isFavorite ? 'var(--color-amber)' : 'var(--color-app-faint)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <Star size={12} fill={selectedHistoryItem.isFavorite ? 'var(--color-amber)' : 'none'} />
                        <span>{selectedHistoryItem.isFavorite ? 'Favorited' : 'Favorite'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div 
                  className="neu-inset" 
                  style={{ 
                    padding: '20px', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid rgba(255,255,255,0.02)',
                    minHeight: '200px'
                  }}
                >
                  {runCopilot.isPending ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: 'var(--color-app-muted)', gap: 10 }}>
                      <LoaderCircle size={28} className="auth-spinner" style={{ color: 'var(--color-teal)' }} />
                      <span style={{ fontSize: '13px' }}>DevFlow Copilot is parsing code tokens and generating markdown...</span>
                    </div>
                  ) : selectedHistoryItem ? (
                    renderResponseMarkdown(selectedHistoryItem.response)
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', color: 'var(--color-app-faint)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                      <Bookmark size={32} style={{ color: 'var(--color-app-faint)', marginBottom: 8 }} />
                      <span>Select a saved run from the sidebar history or run the active tool to view the formatted response.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
