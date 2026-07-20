import { useState, useEffect } from 'react'
import { X, Check, Save, Link2, Unlink2, ExternalLink, Search, ShieldCheck, Zap, RefreshCw } from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { useIntegrationsData, useSaveIntegrationSettings } from './hooks/useIntegrations'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

// ── Brand SVG Icons ────────────────────────────────────────────────────────────
const Icons = {
  GitHub: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  GoogleCalendar: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#fff"/>
      <rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#DADCE0" strokeWidth="1.5"/>
      <rect x="3" y="5" width="18" height="5" rx="2" fill="#1A73E8"/>
      <rect x="3" y="8" width="18" height="2" fill="#1A73E8"/>
      <text x="12" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1A73E8">CAL</text>
      <line x1="8" y1="5" x2="8" y2="3" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="5" x2="16" y2="3" stroke="#1A73E8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Slack: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#E01E5A"/>
      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#36C5F0"/>
      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
      <path d="M17.687 8.834a2.528 2.528 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.527 2.527 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.166 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.522h2.521z" fill="#ECB22E"/>
      <path d="M15.166 17.687a2.527 2.527 0 0 1-2.521-2.521 2.527 2.527 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" fill="#ECB22E"/>
    </svg>
  ),
  Discord: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  Notion: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
    </svg>
  ),
  Jira: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M11.571 11.349L6.154 5.932A.938.938 0 0 0 4.81 7.27l4.085 4.086-4.085 4.086a.938.938 0 0 0 1.344 1.307l5.417-5.4z" fill="#2684FF"/>
      <path d="M11.571 11.349L16.988 5.932a.938.938 0 0 1 1.344 1.338l-4.085 4.086 4.085 4.086a.938.938 0 0 1-1.344 1.307l-5.417-5.4z" fill="url(#jira_grad)"/>
      <defs>
        <linearGradient id="jira_grad" x1="11.571" y1="11.349" x2="18.332" y2="5.932" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0052CC"/>
          <stop offset="1" stopColor="#2684FF"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  Vercel: ({ size = 22, light = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={light ? '#000' : '#fff'}>
      <path d="M24 22.525H0l12-21.05 12 21.05z"/>
    </svg>
  ),
  Render: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 24V0h24v.03C10.867.522 1.25 10.637.006 23.44L0 24zm5.855 0C6.937 13.644 13.744 6.062 24 5.144V0H0v24h5.855zM24 10.29C15.283 11.194 8.352 18.038 7.297 24H24V10.29z"/>
    </svg>
  ),
  MongoDB: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/>
    </svg>
  ),
  Figma: ({ size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" fill="#0ACF83"/>
      <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" fill="#A259FF"/>
      <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" fill="#F24E1E"/>
      <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" fill="#FF7262"/>
      <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" fill="#1ABCFE"/>
    </svg>
  ),
}

// ── Integration Config Definitions ────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id: 'github', category: 'Dev Tools',
    name: 'GitHub', tagline: 'Code & Collaboration',
    desc: 'Sync repositories, pull requests, commits, and issues directly into DevFlow.',
    color: '#a855f7', bg: 'rgba(168,85,247,0.08)',
    Icon: Icons.GitHub,
    fields: [{ key: 'token', label: 'Personal Access Token (PAT)', type: 'password', placeholder: 'ghp_xxxxxxxxxxxx', hint: 'Needs repo, read:user, workflow scopes' }],
    docs: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token',
    features: ['Repos', 'PRs', 'Commits', 'Issues'],
  },
  {
    id: 'googleCalendar', category: 'Productivity',
    name: 'Google Calendar', tagline: 'Scheduling & Events',
    desc: 'Sync sprint deadlines, meetings, and task due dates with your Google Calendar.',
    color: '#1A73E8', bg: 'rgba(26,115,232,0.08)',
    Icon: Icons.GoogleCalendar,
    fields: [
      { key: 'clientId', label: 'OAuth Client ID', type: 'text', placeholder: 'xxxx.apps.googleusercontent.com' },
      { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'AIzaSy...' },
    ],
    docs: 'https://developers.google.com/calendar/api/quickstart/js',
    features: ['Events', 'Deadlines', 'Sprints', 'Reminders'],
  },
  {
    id: 'slack', category: 'Communication',
    name: 'Slack', tagline: 'Team Notifications',
    desc: 'Push task assignments, deployment alerts, and sprint updates to Slack channels.',
    color: '#E01E5A', bg: 'rgba(224,30,90,0.08)',
    Icon: Icons.Slack,
    fields: [
      { key: 'webhookUrl', label: 'Incoming Webhook URL', type: 'password', placeholder: 'https://hooks.slack.com/services/...' },
      { key: 'channel', label: 'Default Channel', type: 'text', placeholder: '#dev-alerts' },
    ],
    docs: 'https://api.slack.com/messaging/webhooks',
    features: ['Task alerts', 'Deploy notifications', 'Sprint updates'],
  },
  {
    id: 'discord', category: 'Communication',
    name: 'Discord', tagline: 'Server Alerts',
    desc: 'Forward project and deployment events to your Discord developer server channels.',
    color: '#5865F2', bg: 'rgba(88,101,242,0.08)',
    Icon: Icons.Discord,
    fields: [{ key: 'webhookUrl', label: 'Discord Webhook URL', type: 'password', placeholder: 'https://discord.com/api/webhooks/...' }],
    docs: 'https://discord.com/developers/docs/resources/webhook',
    features: ['Deploy alerts', 'Task events', 'Issue tracking'],
  },
  {
    id: 'notion', category: 'Productivity',
    name: 'Notion', tagline: 'Docs & Wikis',
    desc: 'Sync DevFlow notes and sprint backlogs directly into Notion workspace pages.',
    color: '#9B59B6', bg: 'rgba(155,89,182,0.08)',
    Icon: Icons.Notion,
    fields: [
      { key: 'apiToken', label: 'Notion Integration Secret', type: 'password', placeholder: 'secret_...' },
      { key: 'databaseId', label: 'Database ID (optional)', type: 'text', placeholder: '32-char UUID' },
    ],
    docs: 'https://developers.notion.com/docs/getting-started',
    features: ['Notes sync', 'Sprint pages', 'Wiki export'],
  },
  {
    id: 'jira', category: 'Dev Tools',
    name: 'Jira', tagline: 'Issue Tracking',
    desc: 'Bridge DevFlow issues with Jira boards for cross-team project velocity tracking.',
    color: '#0052CC', bg: 'rgba(0,82,204,0.08)',
    Icon: Icons.Jira,
    fields: [
      { key: 'serverUrl', label: 'Jira Cloud URL', type: 'text', placeholder: 'https://yourcompany.atlassian.net' },
      { key: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Your Jira API token' },
    ],
    docs: 'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/',
    features: ['Issue sync', 'Board status', 'Velocity tracking'],
  },
  {
    id: 'vercel', category: 'Hosting',
    name: 'Vercel', tagline: 'Deployments',
    desc: 'Monitor Vercel build logs, deployment status, and preview URLs inside DevFlow.',
    color: '#ffffff', bg: 'rgba(255,255,255,0.06)',
    Icon: Icons.Vercel,
    fields: [
      { key: 'apiToken', label: 'Vercel API Token', type: 'password', placeholder: 'xxxx (from Account Settings)' },
      { key: 'projectId', label: 'Project ID', type: 'text', placeholder: 'prj_xxxxxxxxxxxx' },
    ],
    docs: 'https://vercel.com/account/tokens',
    features: ['Build logs', 'Deploy status', 'Preview URLs'],
  },
  {
    id: 'render', category: 'Hosting',
    name: 'Render', tagline: 'Web Services',
    desc: 'Trigger auto-deploys, monitor service health, and stream logs from Render.',
    color: '#00d4aa', bg: 'rgba(0,212,170,0.08)',
    Icon: Icons.Render,
    fields: [
      { key: 'apiToken', label: 'Render API Token', type: 'password', placeholder: 'rnd_xxxxxxxxxxxx' },
      { key: 'serviceId', label: 'Service ID', type: 'text', placeholder: 'srv-xxxxxxxxxxxx' },
    ],
    docs: 'https://docs.render.com/api',
    features: ['Auto-deploy', 'Health checks', 'Live logs'],
  },
  {
    id: 'mongoAtlas', category: 'Database',
    name: 'MongoDB Atlas', tagline: 'Cloud Database',
    desc: 'Connect your Atlas cluster to monitor storage metrics, query performance, and alerts.',
    color: '#10b981', bg: 'rgba(16,185,129,0.08)',
    Icon: Icons.MongoDB,
    fields: [{ key: 'connectionString', label: 'Atlas Connection String (URI)', type: 'password', placeholder: 'mongodb+srv://user:pass@cluster.mongodb.net/db' }],
    docs: 'https://www.mongodb.com/docs/atlas/driver-connection/',
    features: ['Cluster metrics', 'Performance', 'Storage alerts'],
  },
  {
    id: 'figma', category: 'Design',
    name: 'Figma', tagline: 'Design Files',
    desc: 'Link Figma design files to DevFlow projects and track design-to-dev handoffs.',
    color: '#F24E1E', bg: 'rgba(242,78,30,0.08)',
    Icon: Icons.Figma,
    fields: [
      { key: 'accessToken', label: 'Personal Access Token', type: 'password', placeholder: 'figd_...' },
      { key: 'fileKey', label: 'File Key (optional)', type: 'text', placeholder: 'From Figma file URL' },
    ],
    docs: 'https://www.figma.com/developers/api#access-tokens',
    features: ['File linking', 'Asset sync', 'Comment tracking'],
  },
]

const CATEGORIES = ['All', 'Dev Tools', 'Communication', 'Productivity', 'Hosting', 'Database', 'Design']

// ── Category colour chips ─────────────────────────────────────────────────────
const CAT_COLOR = {
  'Dev Tools':     { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  Communication:   { color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
  Productivity:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  Hosting:         { color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
  Database:        { color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  Design:          { color: '#fb923c', bg: 'rgba(251,146,60,0.1)'  },
}

// ── Form state helper ─────────────────────────────────────────────────────────
function buildInitialFields(svc, savedData) {
  const saved = savedData || {}
  return Object.fromEntries(svc.fields.map(f => [f.key, saved[f.key] || '']))
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const { data: integrations, isLoading, refetch } = useIntegrationsData()
  const saveSettings = useSaveIntegrationSettings()

  const [selected, setSelected]       = useState(null)
  const [category, setCategory]       = useState('All')
  const [search, setSearch]           = useState('')
  const [fieldVals, setFieldVals]     = useState({})
  const [successMsg, setSuccessMsg]   = useState('')
  const [errorMsg, setErrorMsg]       = useState('')
  const [showPwd, setShowPwd]         = useState({})

  // Populate fields when a service is selected
  useEffect(() => {
    if (selected && integrations) {
      setFieldVals(buildInitialFields(selected, integrations[selected.id]))
      setSuccessMsg('')
      setErrorMsg('')
      setShowPwd({})
    }
  }, [selected, integrations])

  // Filter integrations
  const visible = INTEGRATIONS.filter(i => {
    const matchCat = category === 'All' || i.category === category
    const matchQ   = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchQ
  })

  const connectedCount = INTEGRATIONS.filter(i => integrations?.[i.id]?.connected).length

  const handleSave = async (e) => {
    e.preventDefault()
    if (!selected) return
    setErrorMsg('')
    const payload = { [selected.id]: { ...fieldVals, connected: true } }
    try {
      await saveSettings.mutateAsync(payload)
      setSuccessMsg('Integration saved & connected!')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch {
      setErrorMsg('Save failed. Check your credentials.')
    }
  }

  const handleDisconnect = async () => {
    if (!selected) return
    const empty = Object.fromEntries(selected.fields.map(f => [f.key, '']))
    const payload = { [selected.id]: { ...empty, connected: false } }
    try {
      await saveSettings.mutateAsync(payload)
      setFieldVals(empty)
      setSuccessMsg('Disconnected successfully.')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch {
      setErrorMsg('Failed to disconnect.')
    }
  }

  if (isLoading) return <LoadingSpinner size={48} />

  const isConnected = (id) => !!integrations?.[id]?.connected

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em', color: 'var(--color-app-text)' }}>
            🔗 Integrations
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-app-muted)', margin: 0 }}>
            Connect your tools once — DevFlow syncs everything automatically.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: '#10b981'
          }}>
            <ShieldCheck size={13} />
            {connectedCount} / {INTEGRATIONS.length} Connected
          </div>
          <button
            onClick={() => refetch()}
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--color-app-muted)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-app-faint)', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search integrations…"
            style={{
              paddingLeft: 30, paddingRight: 12, height: 34, borderRadius: 8, fontSize: 13,
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              color: 'var(--color-app-text)', outline: 'none', width: 200
            }}
          />
        </div>
        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
                background: category === cat ? '#8b5cf6' : 'var(--card-bg)',
                color: category === cat ? '#fff' : 'var(--color-app-muted)',
                border: category === cat ? '1px solid #8b5cf6' : '1px solid var(--card-border)',
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Body — two panel layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16, flex: 1, minHeight: 0, transition: 'all 0.2s ease' }}>

        {/* LEFT: Integration grid */}
        <div style={{ overflowY: 'auto', paddingRight: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
            {visible.map(svc => {
              const connected = isConnected(svc.id)
              const catStyle  = CAT_COLOR[svc.category] || { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' }
              const isActive  = selected?.id === svc.id

              return (
                <div
                  key={svc.id}
                  onClick={() => setSelected(isActive ? null : svc)}
                  style={{
                    background: 'var(--card-bg)',
                    border: isActive ? '1px solid #8b5cf6' : '1px solid var(--card-border)',
                    borderTop: isActive ? '1px solid #a78bfa' : '1px solid var(--card-border-top)',
                    borderLeft: isActive ? '1px solid #8b5cf6' : '1px solid var(--card-border-left)',
                    borderRadius: 14,
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 0 2px rgba(139,92,246,0.2), var(--shadow-card-val)' : 'var(--shadow-card-val)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Accent glow when active */}
                  {isActive && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)', pointerEvents: 'none' }} />
                  )}

                  {/* Top row: icon + status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: svc.bg, border: `1px solid ${svc.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: svc.color, flexShrink: 0,
                    }}>
                      <svc.Icon size={22} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        color: connected ? '#10b981' : 'var(--color-app-faint)',
                        background: connected ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                        border: connected ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: connected ? '#10b981' : 'var(--color-app-faint)', display: 'inline-block' }} />
                        {connected ? 'Connected' : 'Not set'}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 12,
                        color: catStyle.color, background: catStyle.bg,
                      }}>{svc.category}</span>
                    </div>
                  </div>

                  {/* Name + tagline */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-app-text)', marginBottom: 2 }}>{svc.name}</div>
                    <div style={{ fontSize: 11, color: svc.color, fontWeight: 600 }}>{svc.tagline}</div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 11.5, color: 'var(--color-app-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {svc.desc}
                  </p>

                  {/* Feature chips */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {svc.features.map(f => (
                      <span key={f} style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 20,
                        background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)',
                        color: 'var(--color-app-faint)', fontWeight: 600,
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-app-faint)' }}>
              <Link2 size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No integrations match your filter</p>
            </div>
          )}
        </div>

        {/* RIGHT: Config Drawer */}
        {selected && (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderTop: '1px solid var(--card-border-top)',
            borderLeft: '1px solid var(--card-border-left)',
            borderRadius: 16,
            display: 'flex', flexDirection: 'column',
            boxShadow: 'var(--shadow-card-val)',
            overflow: 'hidden',
            animation: 'dropIn 0.15s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <style>{`@keyframes dropIn { from { opacity:0; transform: translateX(12px); } to { opacity:1; transform: translateX(0); } }`}</style>

            {/* Drawer header */}
            <div style={{
              background: 'var(--card-bg-inset)',
              borderBottom: '1px solid var(--card-border)',
              padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: selected.bg, border: `1px solid ${selected.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: selected.color,
                }}>
                  <selected.Icon size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-app-text)' }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: selected.color, fontWeight: 600 }}>{selected.tagline}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-app-faint)', padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Drawer body */}
            <form onSubmit={handleSave} style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Status feedback */}
              {successMsg && (
                <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, color: '#10b981', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={13} /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: 12, fontWeight: 700 }}>
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Connection status indicator */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 12px', borderRadius: 10,
                background: isConnected(selected.id) ? 'rgba(16,185,129,0.06)' : 'var(--card-bg-inset)',
                border: isConnected(selected.id) ? '1px solid rgba(16,185,129,0.2)' : '1px solid var(--card-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isConnected(selected.id) ? '#10b981' : 'var(--color-app-faint)', animation: isConnected(selected.id) ? 'none' : undefined }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: isConnected(selected.id) ? '#10b981' : 'var(--color-app-muted)' }}>
                    {isConnected(selected.id) ? 'Connected & active' : 'Not connected'}
                  </span>
                </div>
                {selected.docs && (
                  <a href={selected.docs} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8b5cf6', textDecoration: 'none', fontWeight: 600 }}>
                    Docs <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* Fields */}
              {selected.fields.map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-app-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {f.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPwd[f.key] ? 'text' : f.type}
                      value={fieldVals[f.key] || ''}
                      onChange={e => setFieldVals(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%', padding: '9px 36px 9px 12px', boxSizing: 'border-box',
                        background: 'var(--card-bg-inset)', border: '1px solid var(--card-border)',
                        borderRadius: 8, color: 'var(--color-app-text)', fontSize: 12.5, outline: 'none',
                        fontFamily: f.type === 'password' ? 'monospace' : 'inherit',
                      }}
                    />
                    {f.type === 'password' && (
                      <button type="button" onClick={() => setShowPwd(v => ({ ...v, [f.key]: !v[f.key] }))}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-app-faint)', fontSize: 10, fontWeight: 700 }}>
                        {showPwd[f.key] ? 'HIDE' : 'SHOW'}
                      </button>
                    )}
                  </div>
                  {f.hint && <span style={{ fontSize: 10.5, color: 'var(--color-app-faint)', lineHeight: 1.4 }}>{f.hint}</span>}
                </div>
              ))}

              {/* Features */}
              <div style={{ padding: '10px 12px', background: 'var(--card-bg-inset)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-app-faint)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  What you get
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {selected.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--color-app-muted)' }}>
                      <Zap size={11} style={{ color: selected.color, flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
                <button
                  type="submit"
                  disabled={saveSettings.isPending}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 9, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
                    border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    opacity: saveSettings.isPending ? 0.7 : 1,
                  }}
                >
                  <Save size={14} />
                  {saveSettings.isPending ? 'Saving…' : 'Save & Connect'}
                </button>

                {isConnected(selected.id) && (
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    style={{
                      width: '100%', padding: '9px', borderRadius: 9, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.05)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Unlink2 size={14} />
                    Disconnect
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  )
}
