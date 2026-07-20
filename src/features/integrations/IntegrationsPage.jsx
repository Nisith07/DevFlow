import { useState, useEffect } from 'react'
import {
  Github, Globe, MessageSquare, Plus, Trash2, Eye, Link2, ExternalLink, HelpCircle, Save, X, Check, ShieldAlert
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import {
  useIntegrationsData,
  useSaveIntegrationSettings
} from './hooks/useIntegrations'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

const SERVICES_CONFIG = [
  { id: 'github', name: 'GitHub Integration', desc: 'Sync code repositories, pull requests, and commit histories.', iconColor: '#a855f7' },
  { id: 'google', name: 'Google SSO', desc: 'Authenticate with Google single sign-on credentials.', iconColor: '#3b82f6' },
  { id: 'slack', name: 'Slack Webhooks', desc: 'Push task assignment notifications to target team channels.', iconColor: '#ec4899' },
  { id: 'discord', name: 'Discord Alerts', desc: 'Forward project sprint updates to developer server channels.', iconColor: '#6366f1' },
  { id: 'notion', name: 'Notion Workspace', desc: 'Sync notes and sprint backlogs directly into Notion wikis.', iconColor: '#111' },
  { id: 'jira', name: 'Jira Software', desc: 'Track issues and project velocity by linking Jira boards.', iconColor: '#2563eb' },
  { id: 'vercel', name: 'Vercel Deployments', desc: 'Verify build logs and hosting statuses via Vercel tokens.', iconColor: '#000' },
  { id: 'render', name: 'Render Web Services', desc: 'Trigger auto-deploy hooks and monitor health endpoints.', iconColor: '#00ffcc' },
  { id: 'mongoAtlas', name: 'MongoDB Atlas', desc: 'Configure cluster connections logs and storage metrics.', iconColor: '#10b981' }
]

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrationsData()
  const saveSettings = useSaveIntegrationSettings()

  // Selected service for detailed config panel
  const [selectedService, setSelectedService] = useState(null) // config object

  // Form inputs state
  const [field1, setField1] = useState('')
  const [field2, setField2] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (integrations && selectedService) {
      const activeObj = integrations[selectedService.id] || {}
      setIsConnected(!!activeObj.connected)

      if (selectedService.id === 'github' || selectedService.id === 'discord' || selectedService.id === 'notion' || selectedService.id === 'mongoAtlas') {
        setField1(activeObj.token || activeObj.webhookUrl || activeObj.apiToken || activeObj.connectionString || '')
        setField2('')
      } else if (selectedService.id === 'slack') {
        setField1(activeObj.webhookUrl || '')
        setField2(activeObj.channel || '')
      } else if (selectedService.id === 'jira' || selectedService.id === 'vercel' || selectedService.id === 'render') {
        setField1(activeObj.serverUrl || activeObj.apiToken || '')
        setField2(activeObj.apiToken || activeObj.projectId || activeObj.serviceId || '')
      } else {
        setField1('')
        setField2('')
      }
    }
  }, [integrations, selectedService])

  const handleSaveConfig = async (e) => {
    e.preventDefault()
    if (!selectedService) return

    const payload = {}
    const activeId = selectedService.id

    if (activeId === 'github') {
      payload.github = { token: field1, connected: !!field1 }
    } else if (activeId === 'google') {
      payload.google = { connected: isConnected }
    } else if (activeId === 'slack') {
      payload.slack = { webhookUrl: field1, channel: field2, connected: !!field1 }
    } else if (activeId === 'discord') {
      payload.discord = { webhookUrl: field1, connected: !!field1 }
    } else if (activeId === 'notion') {
      payload.notion = { apiToken: field1, connected: !!field1 }
    } else if (activeId === 'jira') {
      payload.jira = { serverUrl: field1, apiToken: field2, connected: !!field2 }
    } else if (activeId === 'vercel') {
      payload.vercel = { apiToken: field1, projectId: field2, connected: !!field2 }
    } else if (activeId === 'render') {
      payload.render = { apiToken: field1, serviceId: field2, connected: !!field2 }
    } else if (activeId === 'mongoAtlas') {
      payload.mongoAtlas = { connectionString: field1, connected: !!field1 }
    }

    try {
      await saveSettings.mutateAsync(payload)
      setSuccessMsg('Integration config saved!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      alert('Failed to save settings.')
    }
  }

  const handleDisconnectConfig = async () => {
    if (!selectedService) return
    const activeId = selectedService.id
    const payload = {}

    if (activeId === 'github') payload.github = { token: '', connected: false }
    else if (activeId === 'google') payload.google = { connected: false }
    else if (activeId === 'slack') payload.slack = { webhookUrl: '', channel: '', connected: false }
    else if (activeId === 'discord') payload.discord = { webhookUrl: '', connected: false }
    else if (activeId === 'notion') payload.notion = { apiToken: '', connected: false }
    else if (activeId === 'jira') payload.jira = { serverUrl: '', apiToken: '', connected: false }
    else if (activeId === 'vercel') payload.vercel = { apiToken: '', projectId: '', connected: false }
    else if (activeId === 'render') payload.render = { apiToken: '', serviceId: '', connected: false }
    else if (activeId === 'mongoAtlas') payload.mongoAtlas = { connectionString: '', connected: false }

    try {
      await saveSettings.mutateAsync(payload)
      setField1('')
      setField2('')
      setIsConnected(false)
      setSuccessMsg('Service disconnected successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      alert('Failed to disconnect service.')
    }
  }

  if (isLoading) {
    return <LoadingSpinner size={48} />
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

  // Custom Github SVG helper component
  const GithubIcon = ({ size = 20, style }) => (
    <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )

  const getServiceIcon = (id, color) => {
    if (id === 'github') return <GithubIcon size={20} style={{ color }} />
    return <Link2 size={20} style={{ color }} />
  }

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <PageHeader
        title="Integrations Desk"
        subtitle="Manage secure connections to external developer services, webhooks, databases, and hosting providers."
      />

      {/* Main Split Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* LEFT COLUMN: Grid list of integration cards */}
        <div style={{ overflowY: 'auto', paddingRight: 6 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16
            }}
          >
            {SERVICES_CONFIG.map((serv) => {
              const activeConfig = integrations?.[serv.id] || {}
              const connected = !!activeConfig.connected

              return (
                <div
                  key={serv.id}
                  className="card hover-lift"
                  onClick={() => setSelectedService(serv)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    background: 'var(--color-app-surface)',
                    border: selectedService?.id === serv.id ? '1px solid var(--color-teal)' : '1px solid rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    minHeight: '160px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: `${serv.iconColor}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {getServiceIcon(serv.id, serv.iconColor)}
                      </div>

                      <span style={{
                        fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase',
                        padding: '1px 6px', borderRadius: '4px',
                        color: connected ? 'var(--color-teal)' : 'var(--color-app-faint)',
                        background: connected ? 'rgba(79, 184, 168, 0.1)' : 'rgba(255,255,255,0.03)'
                      }}>
                        {connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-app-text)', margin: '0 0 6px 0' }}>
                      {serv.name}
                    </h4>

                    <p style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', lineHeight: 1.4, margin: 0 }}>
                      {serv.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Drawer sheet */}
        <div style={{ background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {selectedService ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-app-bg)', padding: '12px 16px', borderBottom: '1px solid var(--color-app-border)' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--color-app-muted)', textTransform: 'uppercase' }}>Configure Connection</span>
                <button onClick={() => setSelectedService(null)} style={{ background: 'none', border: 'none', color: 'var(--color-app-muted)', cursor: 'pointer' }}><X size={14} /></button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveConfig} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {successMsg && (
                  <div style={{ padding: '8px 12px', background: 'rgba(79, 184, 168, 0.08)', border: '1px solid rgba(79, 184, 168, 0.2)', borderRadius: '6px', color: 'var(--color-teal)', fontSize: '12px', fontWeight: 'bold' }}>
                    ✓ {successMsg}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: `${selectedService.iconColor}15`, display: 'flex', alignItems: 'center', justifyContents: 'center' }}>
                    {getServiceIcon(selectedService.id, selectedService.iconColor)}
                  </div>
                  <strong style={{ fontSize: '14px', color: '#fff' }}>{selectedService.name}</strong>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--color-app-muted)', lineHeight: 1.4, margin: '4px 0 0 0' }}>
                  {selectedService.desc}
                </p>

                {/* DYNAMIC FIELD RENDERING */}
                {/* Case 1: GitHub / Discord / Notion / MongoAtlas */}
                {(selectedService.id === 'github' || selectedService.id === 'discord' || selectedService.id === 'notion' || selectedService.id === 'mongoAtlas') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>
                      {selectedService.id === 'github' ? 'Personal Access Token (PAT)' :
                       selectedService.id === 'discord' ? 'Discord Webhook URL' :
                       selectedService.id === 'notion' ? 'Notion Integration Secret' :
                       'MongoDB Atlas URI'}
                    </label>
                    <input
                      type="password"
                      value={field1}
                      onChange={(e) => setField1(e.target.value)}
                      required
                      style={selectStyle}
                    />
                  </div>
                )}

                {/* Case 2: Slack */}
                {selectedService.id === 'slack' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Slack Webhook URL</label>
                      <input type="password" value={field1} onChange={(e) => setField1(e.target.value)} required style={selectStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Channel target</label>
                      <input type="text" placeholder="#general" value={field2} onChange={(e) => setField2(e.target.value)} required style={selectStyle} />
                    </div>
                  </div>
                )}

                {/* Case 3: Jira / Vercel / Render */}
                {(selectedService.id === 'jira' || selectedService.id === 'vercel' || selectedService.id === 'render') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>
                        {selectedService.id === 'jira' ? 'Jira Cloud Server URL' : 'API Access Token'}
                      </label>
                      <input type="text" value={field1} onChange={(e) => setField1(e.target.value)} required style={selectStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>
                        {selectedService.id === 'jira' ? 'Jira API Token' :
                         selectedService.id === 'vercel' ? 'Target Project ID' :
                         'Render Service ID'}
                      </label>
                      <input type="password" value={field2} onChange={(e) => setField2(e.target.value)} required style={selectStyle} />
                    </div>
                  </div>
                )}

                {/* Case 4: Google (SSO authentication indicator) */}
                {selectedService.id === 'google' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Google OAuth Status</span>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-app-muted)', margin: 0, lineHeight: 1.4 }}>
                      Your Google account links automatically when signing up or logging in via Google SSO.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected ? 'var(--color-teal)' : 'var(--color-app-faint)' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{isConnected ? 'Linked' : 'Not Linked'}</span>
                    </div>
                  </div>
                )}

                {/* Footer Save / Disconnect triggers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 16 }}>
                  {selectedService.id !== 'google' && (
                    <button type="submit" disabled={saveSettings.isPending} className="app-btn primary" style={{ width: '100%', justifyContent: 'center' }}>
                      {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
                    </button>
                  )}

                  {isConnected && (
                    <button type="button" onClick={handleDisconnectConfig} className="app-btn" style={{ width: '100%', justifyContent: 'center', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                      Disconnect Integration
                    </button>
                  )}
                </div>

              </form>
            </div>
          ) : (
            <EmptyState
              icon={<Globe size={40} style={{ color: 'var(--color-app-faint)' }} />}
              title="Select Service"
              description="Choose a developer integration card on the left to configure credentials settings."
            />
          )}
        </div>

      </div>

    </div>
  )
}
