import { useState, useEffect } from 'react'
import {
  Sparkles, Layers, MessageSquare, Globe, Plus, Trash2, ArrowUp, ArrowDown, Eye, Check, ExternalLink, RefreshCw, Send, Mail, User, Info, AlertCircle
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import {
  usePortfolioData,
  useSavePortfolioData,
  useAddPortfolioMessage,
  useDeployPortfolio
} from './hooks/usePortfolio'
import { useGitHubRepos } from '@/features/github/hooks/useGitHub'
import { useResumeData } from '@/features/resume/hooks/useResume'
import LoadingSpinner from '@/shared/components/LoadingSpinner'
import EmptyState from '@/shared/components/EmptyState'

const THEMES = [
  { id: 'dark', label: 'Dark Charcoal 🖤' },
  { id: 'light', label: 'Snow Minimalist 🤍' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon ⚡' },
  { id: 'neo_brutalist', label: 'Neo-Brutalist Bold 🎨' }
]

export default function PortfolioPage() {
  const { data: portfolio, isLoading } = usePortfolioData()
  const savePortfolio = useSavePortfolioData()
  const addMessage = useAddPortfolioMessage()
  const deploy = useDeployPortfolio()

  // Get active repos and resume details for selector lists
  const { data: repos = [] } = useGitHubRepos()
  const { data: resume } = useResumeData()

  // Tab state
  const [activeTab, setActiveTab] = useState('builder') // builder, inbox, deployment

  // Builder configurations state
  const [theme, setTheme] = useState('dark')
  const [sections, setSections] = useState(['hero', 'about', 'projects', 'skills', 'blog', 'contact'])
  const [visibleSections, setVisibleSections] = useState(['hero', 'about', 'projects', 'skills', 'blog', 'contact'])
  const [aboutText, setAboutText] = useState('')
  const [githubUsername, setGithubUsername] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')

  // Projects list
  const [projectsList, setProjectsList] = useState([])

  // Blog posts
  const [blogPosts, setBlogPosts] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogContent, setNewBlogContent] = useState('')

  // Contact form simulator state in preview
  const [simName, setSimName] = useState('')
  const [simEmail, setSimEmail] = useState('')
  const [simMessage, setSimMessage] = useState('')
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)

  useEffect(() => {
    if (portfolio) {
      setTheme(portfolio.theme || 'dark')
      setSections(portfolio.sectionsOrder || ['hero', 'about', 'projects', 'skills', 'blog', 'contact'])
      setVisibleSections(portfolio.visibleSections || ['hero', 'about', 'projects', 'skills', 'blog', 'contact'])
      setAboutText(portfolio.aboutText || '')
      setGithubUsername(portfolio.githubUsername || '')
      setLinkedinUrl(portfolio.linkedinUrl || '')
      setTwitterUrl(portfolio.twitterUrl || '')
      setProjectsList(portfolio.projectsList || [])
      setBlogPosts(portfolio.blogPosts || [])
    }
  }, [portfolio])

  // Save updates helper
  const handlePersist = async (newObj) => {
    try {
      await savePortfolio.mutateAsync({
        theme: newObj.theme || theme,
        sectionsOrder: newObj.sections || sections,
        visibleSections: newObj.visibleSections || visibleSections,
        aboutText: newObj.aboutText !== undefined ? newObj.aboutText : aboutText,
        githubUsername: newObj.githubUsername !== undefined ? newObj.githubUsername : githubUsername,
        linkedinUrl: newObj.linkedinUrl !== undefined ? newObj.linkedinUrl : linkedinUrl,
        twitterUrl: newObj.twitterUrl !== undefined ? newObj.twitterUrl : twitterUrl,
        projectsList: newObj.projectsList || projectsList,
        blogPosts: newObj.blogPosts || blogPosts
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Section ordering up/down
  const moveSection = (idx, dir) => {
    const copy = [...sections]
    const targetIdx = idx + dir
    if (targetIdx < 0 || targetIdx >= copy.length) return
    const temp = copy[idx]
    copy[idx] = copy[targetIdx]
    copy[targetIdx] = temp
    setSections(copy)
    handlePersist({ sections: copy })
  }

  const toggleSectionVisible = (secName) => {
    let copy = [...visibleSections]
    if (copy.includes(secName)) {
      copy = copy.filter(s => s !== secName)
    } else {
      copy.push(secName)
    }
    setVisibleSections(copy)
    handlePersist({ visibleSections: copy })
  }

  // Project Import / custom addition
  const handleAddProjectFromGitHub = (repoItem) => {
    const alreadyImported = projectsList.some(p => p.githubUrl === repoItem.htmlUrl)
    if (alreadyImported) return
    const updated = [...projectsList, {
      name: repoItem.name,
      description: repoItem.description || '',
      githubUrl: repoItem.htmlUrl,
      demoUrl: '',
      stars: repoItem.stars || 0
    }]
    setProjectsList(updated)
    handlePersist({ projectsList: updated })
  }

  const handleDeleteProject = (idx) => {
    const updated = projectsList.filter((_, i) => i !== idx)
    setProjectsList(updated)
    handlePersist({ projectsList: updated })
  }

  // Blog CRUD
  const handleAddBlog = (e) => {
    e.preventDefault()
    if (!newBlogTitle.trim() || !newBlogContent.trim()) return
    const updated = [...blogPosts, {
      title: newBlogTitle.trim(),
      content: newBlogContent.trim(),
      date: new Date()
    }]
    setBlogPosts(updated)
    setNewBlogTitle('')
    setNewBlogContent('')
    handlePersist({ blogPosts: updated })
  }

  const handleDeleteBlog = (idx) => {
    const updated = blogPosts.filter((_, i) => i !== idx)
    setBlogPosts(updated)
    handlePersist({ blogPosts: updated })
  }

  // Deployed portfolio simulated contact form
  const handleSimSubmitContact = async (e) => {
    e.preventDefault()
    if (!simName.trim() || !simEmail.trim() || !simMessage.trim()) return
    setIsSubmittingMessage(true)
    try {
      await addMessage.mutateAsync({ name: simName, email: simEmail, message: simMessage })
      setSimName('')
      setSimEmail('')
      setSimMessage('')
      alert('Message sent successfully in preview! Check your Inbox tab.')
    } catch (err) {
      alert('Failed to send message.')
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  // Deploy trigger
  const handleDeploy = async () => {
    try {
      await deploy.mutateAsync()
    } catch (err) {
      alert('Failed to deploy portfolio.')
    }
  }

  if (isLoading) {
    return <LoadingSpinner size={40} />
  }

  const selectStyle = {
    padding: '8px 12px',
    background: 'var(--color-app-bg)',
    border: '1px solid var(--color-app-border)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    width: '100%'
  }

  // Preview styling configurations
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          bg: '#f9fafb',
          surface: '#ffffff',
          text: '#111827',
          muted: '#4b5563',
          accent: '#0d9488',
          border: '#e5e7eb'
        }
      case 'cyberpunk':
        return {
          bg: '#0f051d',
          surface: '#170c30',
          text: '#00ffcc',
          muted: '#a855f7',
          accent: '#ff007f',
          border: '1px solid #ff007f'
        }
      case 'neo_brutalist':
        return {
          bg: '#fef08a', // vibrant yellow
          surface: '#ffffff',
          text: '#000000',
          muted: '#1f2937',
          accent: '#06b6d4',
          border: '3px solid #000000'
        }
      default: // dark
        return {
          bg: '#0b0f19',
          surface: '#111827',
          text: '#f9fafb',
          muted: '#9ca3af',
          accent: '#38bdf8',
          border: '1px solid rgba(255,255,255,0.05)'
        }
    }
  }

  const pStyles = getThemeStyles()

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <PageHeader
        title="Portfolio Builder"
        subtitle="Manage sections, test themes, import GitHub projects, and publish your live developer portfolio."
        action={
          <div style={{ display: 'flex', background: 'var(--color-app-surface)', borderRadius: 8, padding: 4, border: '1px solid var(--color-app-border)' }}>
            <button onClick={() => setActiveTab('builder')} style={{ padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === 'builder' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'builder' ? '#fff' : 'var(--color-app-faint)' }}>
              Builder
            </button>
            <button onClick={() => setActiveTab('inbox')} style={{ padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === 'inbox' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'inbox' ? '#fff' : 'var(--color-app-faint)' }}>
              Inbox ({portfolio?.messages?.length || 0})
            </button>
            <button onClick={() => setActiveTab('deployment')} style={{ padding: '6px 14px', borderRadius: 6, fontSize: '12px', fontWeight: '600', cursor: 'pointer', border: 'none', background: activeTab === 'deployment' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'deployment' ? '#fff' : 'var(--color-app-faint)' }}>
              Deploy
            </button>
          </div>
        }
      />

      {/* Grid Layout Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* LEFT COLUMN: Controls tab panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 14, overflow: 'hidden' }}>
          
          {/* BUILDER SETTINGS */}
          {activeTab === 'builder' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Theme & Social settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Theme & Identity</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Portfolio Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value)
                      handlePersist({ theme: e.target.value })
                    }}
                    style={selectStyle}
                  >
                    {THEMES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>GitHub Username</label>
                  <input type="text" value={githubUsername} onChange={(e) => { setGithubUsername(e.target.value); handlePersist({ githubUsername: e.target.value }); }} style={selectStyle} />
                </div>
              </div>

              {/* Drag and Drop Section sorting simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Visible Sections Reorder</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {sections.map((sec, idx) => {
                    const isVisible = visibleSections.includes(sec)
                    return (
                      <div key={sec} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '8px', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="checkbox" checked={isVisible} onChange={() => toggleSectionVisible(sec)} style={{ cursor: 'pointer' }} />
                          <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'capitalize', color: isVisible ? 'var(--color-app-text)' : 'var(--color-app-faint)' }}>{sec}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2 }}>
                          <button onClick={() => moveSection(idx, -1)} disabled={idx === 0} style={{ padding: 4, background: 'none', border: 'none', color: idx === 0 ? 'var(--color-app-faint)' : 'var(--color-teal)', cursor: 'pointer' }}><ArrowUp size={12} /></button>
                          <button onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1} style={{ padding: 4, background: 'none', border: 'none', color: idx === sections.length - 1 ? 'var(--color-app-faint)' : 'var(--color-teal)', cursor: 'pointer' }}><ArrowDown size={12} /></button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bio about details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Hero Bio About Text</label>
                <textarea rows={3} value={aboutText} onChange={(e) => { setAboutText(e.target.value); handlePersist({ aboutText: e.target.value }); }} style={{ ...selectStyle, resize: 'none' }} />
              </div>

              {/* Projects Import Showcase list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Showcase GitHub Projects</span>
                
                {/* Select dropdown from connected repos */}
                <select
                  onChange={(e) => {
                    const repoObj = repos.find(r => r.id === parseInt(e.target.value))
                    if (repoObj) handleAddProjectFromGitHub(repoObj)
                    e.target.value = ''
                  }}
                  style={selectStyle}
                >
                  <option value="">— Link GitHub Repository —</option>
                  {repos.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.private ? 'private' : 'public'})</option>
                  ))}
                </select>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {projectsList.map((p, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-app-text)' }}>{p.name}</span>
                      <button onClick={() => handleDeleteProject(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blog articles creator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Blog Posts</span>
                
                <form onSubmit={handleAddBlog} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--color-app-bg)', padding: '10px', border: '1px solid var(--color-app-border)', borderRadius: '8px' }}>
                  <input type="text" placeholder="Post Title" value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} required style={selectStyle} />
                  <textarea placeholder="Post Content Summary" rows={3} value={newBlogContent} onChange={(e) => setNewBlogContent(e.target.value)} required style={{ ...selectStyle, resize: 'none' }} />
                  <button type="submit" className="app-btn primary" style={{ width: '100%', justifyContent: 'center' }}>+ Add Post</button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {blogPosts.map((post, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-app-text)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>{post.title}</span>
                      <button onClick={() => handleDeleteBlog(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* INBOX MESSAGES */}
          {activeTab === 'inbox' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Received Messages</span>

              {!portfolio?.messages || portfolio.messages.length === 0 ? (
                <EmptyState
                  icon={<MessageSquare size={36} style={{ color: 'var(--color-app-faint)' }} />}
                  title="Inbox is Empty"
                  description="Submit the contact form inside the live preview on the right to test message notifications."
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {portfolio.messages.slice().reverse().map((msg, idx) => (
                    <div key={idx} style={{ padding: '12px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 6 }}>
                        <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--color-app-text)' }}>{msg.name}</span>
                        <span style={{ fontSize: '9px', color: 'var(--color-app-faint)' }}>{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <span style={{ fontSize: '10.5px', color: 'var(--color-teal)' }}>{msg.email}</span>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-app-muted)', lineHeight: 1.4 }}>{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DEPLOYMENT DESK */}
          {activeTab === 'deployment' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Publish Standalone Site</span>
              
              <div style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.04)', border: '1px solid rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8', fontSize: '12.5px', lineHeight: 1.6 }}>
                <Globe size={18} style={{ marginBottom: 6 }} />
                <p style={{ margin: 0 }}>
                  Compile your portfolio configurations, project listings, and contact form API integrations into a production bundle hosted at a custom subdomain.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: portfolio?.isDeployed ? '#10b981' : '#94a3b8' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{portfolio?.isDeployed ? 'Active Deployed' : 'Unpublished'}</span>
                </div>
              </div>

              {portfolio?.isDeployed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: '10.5px', color: 'var(--color-app-muted)' }}>URL</span>
                  <a href={portfolio.deployedUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-teal)', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: '600' }}>
                    <span>{portfolio.deployedUrl}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <button
                className="app-btn primary"
                onClick={handleDeploy}
                disabled={deploy.isPending}
                style={{ width: '100%', justifyContent: 'center', height: '38px', marginTop: 10 }}
              >
                {deploy.isPending ? 'Bundling and Deploying...' : portfolio?.isDeployed ? 'Redeploy Portfolio' : 'Deploy Portfolio'}
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Realtime visual mockup preview simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          
          {/* Header toolbar for visual preview */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-app-surface)', border: '1px solid var(--color-app-border)', borderBottom: 'none', borderRadius: '14px 14px 0 0', padding: '10px 16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> <span>Interactive Site Preview</span>
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-app-faint)', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Theme: {theme.toUpperCase().replace('_', ' ')}
            </span>
          </div>

          {/* Sandbox paper scroll preview */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#0e121e', border: '1px solid var(--color-app-border)', borderRadius: '0 0 14px 14px', padding: '20px' }}>
            
            {/* Visual template site box */}
            <div
              style={{
                width: '100%',
                minHeight: '600px',
                background: pStyles.bg,
                color: pStyles.text,
                border: theme === 'neo_brutalist' ? pStyles.border : 'none',
                borderRadius: theme === 'neo_brutalist' ? '0px' : '10px',
                padding: '30px',
                boxSizing: 'border-box',
                fontFamily: 'system-ui, sans-serif'
              }}
            >
              {/* Loop rendering sections in order! */}
              {sections.map((sectionName) => {
                const isVisible = visibleSections.includes(sectionName)
                if (!isVisible) return null

                switch (sectionName) {
                  
                  // HERO SECTION
                  case 'hero':
                    return (
                      <div key="hero" style={{ padding: '20px 0', borderBottom: `1px dashed ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, marginBottom: 20 }}>
                        <h1 style={{ fontSize: '28px', margin: 0, fontWeight: '900', color: pStyles.accent }}>
                          {resume?.personalInfo?.name || 'Developer Identity'}
                        </h1>
                        <h2 style={{ fontSize: '16px', margin: '4px 0 10px', fontWeight: '700', color: pStyles.text }}>
                          {resume?.personalInfo?.title || 'Software Engineer'}
                        </h2>
                        <p style={{ fontSize: '13px', color: pStyles.muted, margin: '0 0 16px', lineHeight: 1.5 }}>
                          {aboutText || 'Hi, welcome to my developer showcase portfolio.'}
                        </p>
                        
                        {/* Download Resume Link simulator */}
                        {resume?.personalInfo?.name && (
                          <button
                            onClick={() => alert('Downloading resume generated in Resume Builder...')}
                            style={{
                              background: theme === 'neo_brutalist' ? '#fff' : pStyles.accent,
                              color: theme === 'neo_brutalist' ? '#000' : '#fff',
                              border: theme === 'neo_brutalist' ? '2px solid #000' : 'none',
                              padding: '6px 14px',
                              borderRadius: theme === 'neo_brutalist' ? '0px' : '6px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}
                          >
                            Download Resume (PDF)
                          </button>
                        )}
                      </div>
                    )

                  // ABOUT TEXT SECTION
                  case 'about':
                    return (
                      <div key="about" style={{ padding: '10px 0 20px', borderBottom: `1px dashed ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, marginBottom: 20 }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: pStyles.accent }}>About Me</h3>
                        <p style={{ margin: 0, fontSize: '12.5px', color: pStyles.muted, lineHeight: 1.5, textAlign: 'justify' }}>
                          {resume?.personalInfo?.summary || 'No resume summary configured. Please set up Resume Builder info.'}
                        </p>
                      </div>
                    )

                  // PROJECTS LIST SECTION
                  case 'projects':
                    return (
                      <div key="projects" style={{ padding: '10px 0 20px', borderBottom: `1px dashed ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, marginBottom: 20 }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: pStyles.accent }}>Selected Work</h3>
                        
                        {projectsList.length === 0 ? (
                          <p style={{ fontSize: '12px', color: pStyles.muted, margin: 0 }}>No projects selected. Link GitHub repositories in Builder.</p>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {projectsList.map((p, i) => (
                              <div key={i} style={{ padding: '12px', background: pStyles.surface, border: theme === 'neo_brutalist' ? '2px solid #000' : `1px solid ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, borderRadius: theme === 'neo_brutalist' ? 0 : 8 }}>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 'bold', color: pStyles.text }}>{p.name}</h4>
                                <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: pStyles.muted, height: '34px', overflow: 'hidden' }}>{p.description}</p>
                                <span style={{ fontSize: '10px', color: pStyles.accent, fontWeight: '700' }}>★ {p.stars} stars</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )

                  // SKILLS LIST SECTION
                  case 'skills':
                    return (
                      <div key="skills" style={{ padding: '10px 0 20px', borderBottom: `1px dashed ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, marginBottom: 20 }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: pStyles.accent }}>Core Stack</h3>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(resume?.skills || ['JavaScript', 'React', 'HTML', 'CSS']).map((skill, idx) => (
                            <span key={idx} style={{
                              fontSize: '11px', fontWeight: 'bold',
                              padding: '3px 8px',
                              borderRadius: theme === 'neo_brutalist' ? '0px' : '4px',
                              background: pStyles.surface,
                              border: theme === 'neo_brutalist' ? '1px solid #000' : 'none',
                              color: pStyles.text
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )

                  // BLOG SECTION
                  case 'blog':
                    return (
                      <div key="blog" style={{ padding: '10px 0 20px', borderBottom: `1px dashed ${pStyles.border === 'none' ? 'rgba(255,255,255,0.05)' : pStyles.border}`, marginBottom: 20 }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: pStyles.accent }}>Articles</h3>
                        
                        {blogPosts.length === 0 ? (
                          <p style={{ fontSize: '12px', color: pStyles.muted, margin: 0 }}>No blog posts added yet. Add posts in Builder.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {blogPosts.map((post, idx) => (
                              <div key={idx} style={{ paddingBottom: '8px', borderBottom: `1px solid ${pStyles.border === 'none' ? 'rgba(255,255,255,0.02)' : pStyles.border}` }}>
                                <h4 style={{ margin: '0 0 3px 0', fontSize: '13px', fontWeight: '700', color: pStyles.text }}>{post.title}</h4>
                                <p style={{ margin: 0, fontSize: '11.5px', color: pStyles.muted }}>{post.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )

                  // CONTACT FORM SECTION
                  case 'contact':
                    return (
                      <div key="contact" style={{ padding: '10px 0 10px' }}>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.05em', color: pStyles.accent }}>Get In Touch</h3>
                        
                        <form onSubmit={handleSimSubmitContact} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <input type="text" placeholder="Name" value={simName} onChange={(e) => setSimName(e.target.value)} required style={{ padding: '6px 10px', background: pStyles.surface, border: theme === 'neo_brutalist' ? '2px solid #000' : 'none', color: pStyles.text, fontSize: '12px', outline: 'none' }} />
                            <input type="email" placeholder="Email" value={simEmail} onChange={(e) => setSimEmail(e.target.value)} required style={{ padding: '6px 10px', background: pStyles.surface, border: theme === 'neo_brutalist' ? '2px solid #000' : 'none', color: pStyles.text, fontSize: '12px', outline: 'none' }} />
                          </div>
                          <textarea placeholder="Message" rows={2} value={simMessage} onChange={(e) => setSimMessage(e.target.value)} required style={{ padding: '6px 10px', background: pStyles.surface, border: theme === 'neo_brutalist' ? '2px solid #000' : 'none', color: pStyles.text, fontSize: '12px', outline: 'none', resize: 'none' }} />
                          
                          <button
                            type="submit"
                            disabled={isSubmittingMessage}
                            style={{
                              background: theme === 'neo_brutalist' ? '#fff' : pStyles.accent,
                              color: theme === 'neo_brutalist' ? '#000' : '#fff',
                              border: theme === 'neo_brutalist' ? '2px solid #000' : 'none',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '11.5px',
                              alignSelf: 'flex-start'
                            }}
                          >
                            {isSubmittingMessage ? 'Sending...' : 'Send Message'}
                          </button>
                        </form>
                      </div>
                    )

                  default:
                    return null
                }
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
