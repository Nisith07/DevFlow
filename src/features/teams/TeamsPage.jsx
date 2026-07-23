import { useState, useRef, useEffect } from 'react'
import {
  Users, CheckSquare, MessageSquare, Video, Palette, Plus, Search, Send, Mic, MicOff,
  Video as VideoIcon, VideoOff, ScreenShare, Copy, Check, Sparkles, Download, Eraser,
  Square, Circle, ArrowRight, Type, Move, RotateCcw, UserPlus, Clock, AlertTriangle, ShieldCheck
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { useAuth } from '@/features/auth/hooks/useAuth'

// Mock initial team members
const INITIAL_MEMBERS = [
  { id: '1', name: 'Nisith Bhowmik', role: 'Full Stack Lead', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces', status: 'coding', taskCount: 8, completedCount: 6, workload: 85 },
  { id: '2', name: 'Alex Rivera', role: 'Backend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', status: 'online', taskCount: 6, completedCount: 4, workload: 70 },
  { id: '3', name: 'Sophia Chen', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', status: 'meeting', taskCount: 5, completedCount: 5, workload: 60 },
  { id: '4', name: 'David Kim', role: 'DevOps & Cloud Architect', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', status: 'offline', taskCount: 4, completedCount: 2, workload: 45 },
]

// Mock initial chat messages
const INITIAL_CHAT = [
  { id: 'm1', sender: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', text: 'Hey team! The new GraphQL API endpoint for project analytics is deployed to staging 🚀', time: '10:14 AM' },
  { id: 'm2', sender: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', text: 'Awesome! I updated the Figma component library for Dark and Neo-Brutalist themes.', time: '10:18 AM' },
  { id: 'm3', sender: 'Nisith Bhowmik', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces', text: 'Great work! Let us sync up in the Standup Meeting room at 11:00 AM.', time: '10:25 AM' },
]

export default function TeamsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('progress') // progress, chat, meeting, whiteboard

  // Members & Workload state
  const [members, setMembers] = useState(INITIAL_MEMBERS)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('')

  // Chat State
  const [activeChannel, setActiveChannel] = useState('#general')
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT)
  const [chatInput, setChatInput] = useState('')

  // Meeting State
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Whiteboard Canvas State
  const canvasRef = useRef(null)
  const [drawTool, setDrawTool] = useState('pencil') // pencil, rect, circle, line, eraser
  const [drawColor, setDrawColor] = useState('#FF7A1A')
  const [lineWidth, setLineWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [canvasHistory, setCanvasHistory] = useState([])

  // Init canvas context background
  useEffect(() => {
    if (activeTab === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      // Fill canvas background
      ctx.fillStyle = '#0F131F'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // Save blank state to history
      setCanvasHistory([canvas.toDataURL()])
    }
  }, [activeTab])

  // Add new member
  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newMemberName.trim()) return
    const newM = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      role: newMemberRole.trim() || 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      status: 'online',
      taskCount: 3,
      completedCount: 1,
      workload: 40
    }
    setMembers(prev => [...prev, newM])
    setNewMemberName('')
    setNewMemberRole('')
    setShowAssignModal(false)
  }

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const newMsg = {
      id: Date.now().toString(),
      sender: user?.name || 'Nisith Bhowmik',
      avatar: user?.avatarUrl || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setChatMessages(prev => [...prev, newMsg])
    setChatInput('')
  }

  // Copy Meeting Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://devflow.app/meeting/room-alpha-99')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Drawing Handlers for Whiteboard
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setStartPos({ x, y })

    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = drawTool === 'eraser' ? '#0F131F' : drawColor
    ctx.lineWidth = drawTool === 'eraser' ? lineWidth * 4 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (drawTool === 'pencil' || drawTool === 'eraser') {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext('2d')

    ctx.strokeStyle = drawColor
    ctx.lineWidth = lineWidth

    if (drawTool === 'rect') {
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y)
    } else if (drawTool === 'circle') {
      ctx.beginPath()
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2))
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (drawTool === 'line') {
      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    setIsDrawing(false)
    setCanvasHistory(prev => [...prev, canvas.toDataURL()])
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0F131F'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const exportCanvasPNG = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'devflow-whiteboard.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <PageHeader
        title="Team Hub"
        subtitle="Jira-style work progress, team member workload, channel chat, live standups, & Excalidraw whiteboard."
        action={
          <div style={{ display: 'inline-flex', background: 'var(--card-bg-inset)', borderRadius: '10px', padding: '3px', border: '1px solid var(--card-border)' }}>
            {[
              { id: 'progress', label: 'Progress & Members', icon: Users },
              { id: 'chat', label: 'Team Chat', icon: MessageSquare },
              { id: 'meeting', label: 'Live Standup', icon: Video },
              { id: 'whiteboard', label: 'Excalidraw Canvas', icon: Palette },
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isActive ? '700' : '600',
                    cursor: 'pointer',
                    border: 'none',
                    background: isActive ? 'var(--accent-color)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-app-muted)',
                    boxShadow: isActive ? '0 3px 10px rgba(255,122,26,0.3)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════
         1. TAB 1: WORK PROGRESS & TEAM MEMBERS DIRECTORY
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'progress' && (
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Top Overall Sprint Progress Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '18px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Overall Sprint Progress</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-app-text)' }}>74%</span>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>+12% this week</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ width: '74%', height: '100%', background: 'linear-gradient(90deg, #FF7A1A, #10B981)' }} />
              </div>
            </div>

            <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '18px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Team Members</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-app-text)' }}>{members.length}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-teal)', fontWeight: 'bold' }}>3 Online Now</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', display: 'block', marginTop: 8 }}>Cross-functional engineering pod</span>
            </div>

            <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '18px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Assigned Tasks</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-app-text)' }}>23</span>
                <span style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 'bold' }}>17 Completed</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', display: 'block', marginTop: 8 }}>Sprint 14 Target: 25 tasks</span>
            </div>

            <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '18px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>Team Health Score</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: '#10B981' }}>98/100</span>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>Optimal</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', display: 'block', marginTop: 8 }}>Zero blockers reported today</span>
            </div>
          </div>

          {/* Member Workload Directory Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-app-text)' }}>Team Members & Workload</h3>
            <button
              onClick={() => setShowAssignModal(true)}
              className="app-btn primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <UserPlus size={14} />
              <span>Add Team Member</span>
            </button>
          </div>

          {/* Member Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {members.map(m => (
              <div
                key={m.id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 14,
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  boxShadow: 'var(--shadow-card-val)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={m.avatar} alt={m.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--color-app-text)', display: 'block' }}>{m.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--color-app-muted)' }}>{m.role}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: m.status === 'coding' ? 'rgba(255,122,26,0.15)' : m.status === 'meeting' ? 'rgba(167,139,250,0.15)' : m.status === 'online' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                      color: m.status === 'coding' ? '#FF7A1A' : m.status === 'meeting' ? '#A78BFA' : m.status === 'online' ? '#10B981' : 'var(--color-app-muted)',
                      textTransform: 'capitalize'
                    }}
                  >
                    ● {m.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--color-app-muted)' }}>Sprint Completion Rate</span>
                    <strong style={{ color: 'var(--color-app-text)' }}>{m.completedCount} / {m.taskCount} Tasks ({Math.round((m.completedCount / m.taskCount) * 100)}%)</strong>
                  </div>
                  <div style={{ height: 6, background: 'var(--card-bg-inset)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round((m.completedCount / m.taskCount) * 100)}%`, height: '100%', background: 'var(--accent-color)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--card-border)' }}>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Workload Capacity: <strong style={{ color: m.workload > 80 ? '#EF4444' : '#10B981' }}>{m.workload}%</strong></span>
                  <button className="app-btn" style={{ fontSize: '11.5px', padding: '4px 10px' }}>Assign Task</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
         2. TAB 2: TEAM CHAT & CHANNEL SYNC
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'chat' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Channels Sidebar */}
          <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Team Channels</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['#general', '#sprint-dev', '#code-reviews', '#incident-log'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeChannel === ch ? '700' : '500',
                    background: activeChannel === ch ? 'var(--accent-color)' : 'transparent',
                    color: activeChannel === ch ? '#FFFFFF' : 'var(--color-app-muted)',
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Panel */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Channel Top Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px', color: 'var(--color-app-text)' }}>{activeChannel}</strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>4 members active</span>
            </div>

            {/* Messages Feed */}
            <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', gap: 12 }}>
                  <img src={msg.avatar} alt={msg.sender} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: '13px', color: 'var(--color-app-text)' }}>{msg.sender}</strong>
                      <span style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>{msg.time}</span>
                    </div>
                    <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: 'var(--color-app-text)', maxWidth: '600px', lineHeight: 1.5 }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} style={{ padding: '14px 20px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder={`Message ${activeChannel}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'var(--card-bg-inset)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  color: 'var(--color-app-text)',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button type="submit" className="app-btn primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Send size={14} />
                <span>Send</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
         3. TAB 3: LIVE VIRTUAL STANDUP MEETING ROOM
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'meeting' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Meeting Room Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, minHeight: 0 }}>
            {/* Participant 1: User (Camera Preview) */}
            <div style={{ background: '#090D16', border: '1px solid var(--card-border)', borderRadius: 14, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCamOn ? (
                <div style={{ textAlign: 'center', color: '#10B981' }}>
                  <VideoIcon size={48} style={{ margin: '0 auto 10px', opacity: 0.8 }} />
                  <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Live Camera Active</span>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-app-muted)' }}>
                  <VideoOff size={48} style={{ margin: '0 auto 10px' }} />
                  <span style={{ fontSize: '13px' }}>Camera Muted</span>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                {user?.name || 'Nisith Bhowmik'} (Host) {isMicOn ? '🎤' : '🔇'}
              </div>
            </div>

            {/* Participant 2: Alex Rivera */}
            <div style={{ background: '#090D16', border: '1px solid var(--card-border)', borderRadius: 14, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces" alt="Alex" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                Alex Rivera (Backend Lead) 🎤
              </div>
            </div>
          </div>

          {/* Meeting Control Dock */}
          <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-app-text)' }}>Room: #daily-standup-alpha</span>
              <button onClick={handleCopyLink} className="app-btn" style={{ padding: '6px 12px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {copiedLink ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setIsMicOn(!isMicOn)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: isMicOn ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: isMicOn ? '#10B981' : '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <button onClick={() => setIsCamOn(!isCamOn)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: isCamOn ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: isCamOn ? '#10B981' : '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCamOn ? <VideoIcon size={18} /> : <VideoOff size={18} />}
              </button>
              <button onClick={() => setIsSharing(!isSharing)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: isSharing ? 'var(--accent-color)' : 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ScreenShare size={18} />
              </button>
            </div>

            <button className="app-btn" style={{ background: '#EF4444', color: '#fff', padding: '8px 16px', fontSize: '12px', fontWeight: 'bold' }}>Leave Standup</button>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
         4. TAB 4: EXCALIDRAW ARCHITECTURE WHITEBOARD CANVAS
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'whiteboard' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0, overflow: 'hidden' }}>
          
          {/* Whiteboard Toolbar */}
          <div style={{ background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {[
                { id: 'pencil', label: 'Pencil', icon: Palette },
                { id: 'rect', label: 'Rectangle', icon: Square },
                { id: 'circle', label: 'Circle', icon: Circle },
                { id: 'line', label: 'Line', icon: ArrowRight },
                { id: 'eraser', label: 'Eraser', icon: Eraser },
              ].map(t => {
                const Icon = t.icon
                const isSelected = drawTool === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setDrawTool(t.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--accent-color)' : 'transparent',
                      color: isSelected ? '#FFFFFF' : 'var(--color-app-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: '12px',
                      fontWeight: isSelected ? '700' : '500'
                    }}
                  >
                    <Icon size={14} />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Color Swatches */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Color:</span>
              {['#FF7A1A', '#00F0FF', '#FF007F', '#10B981', '#FFFFFF', '#A78BFA'].map(c => (
                <div
                  key={c}
                  onClick={() => setDrawColor(c)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    border: drawColor === c ? '2px solid #fff' : 'none',
                    boxShadow: drawColor === c ? '0 0 8px ' + c : 'none'
                  }}
                />
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={clearCanvas} className="app-btn" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                <RotateCcw size={13} />
                <span>Clear Canvas</span>
              </button>
              <button onClick={exportCanvasPNG} className="app-btn primary" style={{ fontSize: '11.5px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={13} />
                <span>Export PNG</span>
              </button>
            </div>
          </div>

          {/* Canvas Board */}
          <div style={{ flex: 1, background: '#0F131F', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas
              ref={canvasRef}
              width={1100}
              height={650}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{ cursor: drawTool === 'eraser' ? 'cell' : 'crosshair', display: 'block' }}
            />
          </div>

        </div>
      )}

      {/* Add Member Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <form onSubmit={handleAddMember} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-dropdown-val)' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--color-app-text)' }}>Add Team Member</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Member Name</label>
              <input type="text" placeholder="e.g. Sarah Jenkins" value={newMemberName} onChange={e => setNewMemberName(e.target.value)} required style={{ padding: '9px 12px', background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--color-app-text)', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Role / Specialty</label>
              <input type="text" placeholder="e.g. Frontend Engineer" value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} style={{ padding: '9px 12px', background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)', borderRadius: 8, color: 'var(--color-app-text)', fontSize: '13px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
              <button type="button" className="app-btn" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button type="submit" className="app-btn primary">Add Member</button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
