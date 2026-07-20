import { useState, useEffect } from 'react'
import {
  User, Shield, Lock, Palette, Bell, Globe, Languages, Link, LoaderCircle, AlertTriangle, Check
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSaveSettings } from './hooks/useSettings'

const TIMEZONES = ['UTC', 'GMT', 'EST', 'PST', 'IST', 'CET']
const LANGUAGES_LIST = [
  { code: 'en', label: 'English 🇺🇸' },
  { code: 'es', label: 'Spanish 🇪🇸' },
  { code: 'fr', label: 'French 🇫🇷' },
  { code: 'de', label: 'German 🇩🇪' },
  { code: 'ja', label: 'Japanese 🇯🇵' }
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const saveSettings = useSaveSettings()

  // Selected tab state
  const [activeTab, setActiveTab] = useState('profile') // profile, account, password, theme, notifications, timezone, language, connected

  // Form Fields State
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Nested settings states
  const [theme, setTheme] = useState('dark')
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifySms, setNotifySms] = useState(false)
  const [notifySound, setNotifySound] = useState(true)
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')

  // Connected accounts
  const [githubConnected, setGithubConnected] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [linkedinConnected, setLinkedinConnected] = useState(false)

  // Status feedback
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setAvatarUrl(user.avatarUrl || '')
      setBio(user.bio || '')
      setUsername(user.username || '')
      setEmail(user.email || '')
      
      const s = user.settings || {}
      setTheme(s.theme || 'dark')
      setTimezone(s.timezone || 'UTC')
      setLanguage(s.language || 'en')
      
      const n = s.notifications || {}
      setNotifyEmail(n.email !== undefined ? n.email : true)
      setNotifySms(n.sms !== undefined ? n.sms : false)
      setNotifySound(n.sound !== undefined ? n.sound : true)

      const c = s.connectedAccounts || {}
      setGithubConnected(!!c.githubConnected)
      setGoogleConnected(!!c.googleConnected)
      setLinkedinConnected(!!c.linkedinConnected)
    }
  }, [user])

  const triggerFeedback = (success, text) => {
    if (success) {
      setSuccessMsg(text)
      setErrorMsg('')
      setTimeout(() => setSuccessMsg(''), 3000)
    } else {
      setErrorMsg(text)
      setSuccessMsg('')
      setTimeout(() => setErrorMsg(''), 4000)
    }
  }

  // Handle updates submissions
  const handleUpdateSettings = async (e) => {
    if (e) e.preventDefault()
    try {
      await saveSettings.mutateAsync({
        name,
        avatarUrl,
        bio,
        username,
        email,
        theme,
        timezone,
        language,
        notifications: { email: notifyEmail, sms: notifySms, sound: notifySound },
        connectedAccounts: { githubConnected, googleConnected, linkedinConnected }
      })
      triggerFeedback(true, 'Settings updated successfully!')
    } catch (err) {
      triggerFeedback(false, err.response?.data?.message || 'Failed to update settings.')
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      triggerFeedback(false, 'New passwords do not match.')
      return
    }
    try {
      await saveSettings.mutateAsync({
        currentPassword,
        newPassword
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      triggerFeedback(true, 'Password updated successfully!')
    } catch (err) {
      triggerFeedback(false, err.response?.data?.message || 'Failed to update password.')
    }
  }

  const handleDeactivate = async () => {
    if (window.confirm('WARNING: Are you absolutely sure you want to deactivate and permanently delete your account? This action cannot be undone.')) {
      try {
        await saveSettings.mutateAsync({ deactivateAccount: true })
        logout()
      } catch (err) {
        alert('Failed to deactivate account.')
      }
    }
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

  return (
    <div className="view-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <PageHeader
        title="Settings Center"
        subtitle="Manage your personal developer profile, notification preferences, themes, and password updates."
      />

      {/* Main settings grid panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: 24,
          flex: 1,
          minHeight: 0,
          background: 'var(--color-app-surface)',
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 14,
          padding: '24px',
          boxSizing: 'border-box'
        }}
      >
        {/* LEFT COLUMN: Sidebar Navigation tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderRight: '1px solid var(--color-app-border)', paddingRight: 16 }}>
          <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'profile' ? '700' : '500', background: activeTab === 'profile' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'profile' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <User size={14} /> <span>Profile settings</span>
          </button>
          <button onClick={() => setActiveTab('account')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'account' ? '700' : '500', background: activeTab === 'account' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'account' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Shield size={14} /> <span>Account security</span>
          </button>
          <button onClick={() => setActiveTab('password')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'password' ? '700' : '500', background: activeTab === 'password' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'password' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Lock size={14} /> <span>Update Password</span>
          </button>
          <button onClick={() => setActiveTab('theme')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'theme' ? '700' : '500', background: activeTab === 'theme' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'theme' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Palette size={14} /> <span>Themes UI</span>
          </button>
          <button onClick={() => setActiveTab('notifications')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'notifications' ? '700' : '500', background: activeTab === 'notifications' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'notifications' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Bell size={14} /> <span>Notifications</span>
          </button>
          <button onClick={() => setActiveTab('timezone')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'timezone' ? '700' : '500', background: activeTab === 'timezone' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'timezone' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Globe size={14} /> <span>Timezone</span>
          </button>
          <button onClick={() => setActiveTab('language')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'language' ? '700' : '500', background: activeTab === 'language' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'language' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Languages size={14} /> <span>Language</span>
          </button>
          <button onClick={() => setActiveTab('connected')} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === 'connected' ? '700' : '500', background: activeTab === 'connected' ? 'var(--color-app-bg)' : 'transparent', color: activeTab === 'connected' ? 'var(--color-teal)' : 'var(--color-app-muted)' }}>
            <Link size={14} /> <span>Connected Apps</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Settings content panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', paddingRight: 6 }}>
          
          {/* Status Messages */}
          {successMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(79, 184, 168, 0.08)', border: '1px solid rgba(79, 184, 168, 0.2)', borderRadius: '8px', color: 'var(--color-teal)', fontSize: '13px', fontWeight: 'bold' }}>
              ✓ {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 'bold' }}>
              ⚠ {errorMsg}
            </div>
          )}

          {/* A. PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Profile details</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Avatar Image URL</label>
                <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Personal Biography / Resume Header</label>
                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} style={{ ...selectStyle, resize: 'none' }} />
              </div>

              <button type="submit" disabled={saveSettings.isPending} className="app-btn primary" style={{ alignSelf: 'flex-start' }}>
                {saveSettings.isPending ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* B. ACCOUNT SETTINGS */}
          {activeTab === 'account' && (
            <form onSubmit={handleUpdateSettings} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Account settings</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. nisithdev" style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={selectStyle} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="submit" disabled={saveSettings.isPending} className="app-btn primary">
                  {saveSettings.isPending ? 'Saving...' : 'Save Account Settings'}
                </button>
                
                <button type="button" onClick={handleDeactivate} style={{ color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }} className="app-btn">
                  Deactivate Account
                </button>
              </div>
            </form>
          )}

          {/* C. PASSWORD UPDATE */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Update password</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={selectStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={selectStyle} />
              </div>

              <button type="submit" disabled={saveSettings.isPending} className="app-btn primary" style={{ alignSelf: 'flex-start' }}>
                {saveSettings.isPending ? 'Saving...' : 'Save New Password'}
              </button>
            </form>
          )}

          {/* D. THEME SELECTION */}
          {activeTab === 'theme' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Themes configurations</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div onClick={() => { setTheme('dark'); saveSettings.mutate({ theme: 'dark' }); }} style={{ padding: '16px', background: 'var(--color-app-bg)', border: theme === 'dark' ? '2px solid var(--color-teal)' : '1px solid var(--color-app-border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', display: 'block', marginBottom: 4 }}>Dark charcoal</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-app-muted)' }}>Traditional dark developer workspace theme.</span>
                </div>

                <div onClick={() => { setTheme('light'); saveSettings.mutate({ theme: 'light' }); }} style={{ padding: '16px', background: '#fff', border: theme === 'light' ? '2px solid var(--color-teal)' : '1px solid var(--color-app-border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#000', display: 'block', marginBottom: 4 }}>Snow Minimalist</span>
                  <span style={{ fontSize: '11px', color: '#4b5563' }}>Clean white styling dashboard theme.</span>
                </div>

                <div onClick={() => { setTheme('cyberpunk'); saveSettings.mutate({ theme: 'cyberpunk' }); }} style={{ padding: '16px', background: '#170c30', border: theme === 'cyberpunk' ? '2px solid var(--color-teal)' : '1px solid var(--color-app-border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#00ffcc', display: 'block', marginBottom: 4 }}>Cyberpunk Neon</span>
                  <span style={{ fontSize: '11px', color: '#a855f7' }}>Retro arcade cyberpunk borders style.</span>
                </div>

                <div onClick={() => { setTheme('neo_brutalist'); saveSettings.mutate({ theme: 'neo_brutalist' }); }} style={{ padding: '16px', background: '#fef08a', border: theme === 'neo_brutalist' ? '2px solid var(--color-teal)' : '1px solid var(--color-app-border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#000', display: 'block', marginBottom: 4 }}>Neo-Brutalist</span>
                  <span style={{ fontSize: '11px', color: '#000' }}>Vibrant comic colors and thick offset lines.</span>
                </div>
              </div>
            </div>
          )}

          {/* E. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Notifications alerts</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>Email Alerts</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Send email logs when task deadlines approach.</span>
                  </div>
                  <input type="checkbox" checked={notifyEmail} onChange={(e) => { setNotifyEmail(e.target.checked); saveSettings.mutate({ notifications: { email: e.target.checked } }); }} style={{ width: 16, height: 16 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>SMS alerts notifications</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Get mobile texts when sprint tasks are assigned.</span>
                  </div>
                  <input type="checkbox" checked={notifySms} onChange={(e) => { setNotifySms(e.target.checked); saveSettings.mutate({ notifications: { sms: e.target.checked } }); }} style={{ width: 16, height: 16 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>Sound alert effects</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Trigger audio bells when tasks checklists are finished.</span>
                  </div>
                  <input type="checkbox" checked={notifySound} onChange={(e) => { setNotifySound(e.target.checked); saveSettings.mutate({ notifications: { sound: e.target.checked } }); }} style={{ width: 16, height: 16 }} />
                </div>
              </div>
            </div>
          )}

          {/* F. TIMEZONE */}
          {activeTab === 'timezone' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Choose active timezone</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Timezone location</label>
                <select
                  value={timezone}
                  onChange={(e) => {
                    setTimezone(e.target.value)
                    saveSettings.mutate({ timezone: e.target.value })
                  }}
                  style={selectStyle}
                >
                  {TIMEZONES.map(t => (
                    <option key={t} value={t}>{t} UTC Offset</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* G. LANGUAGE */}
          {activeTab === 'language' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Choose system language</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value)
                    saveSettings.mutate({ language: e.target.value })
                  }}
                  style={selectStyle}
                >
                  {LANGUAGES_LIST.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* H. CONNECTED ACCOUNTS */}
          {activeTab === 'connected' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Linked Integrations</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* GitHub */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>GitHub Integration</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Connect code commits, pull requests, and releases proxies.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setGithubConnected(!githubConnected); saveSettings.mutate({ connectedAccounts: { githubConnected: !githubConnected } }); }}
                    className="app-btn"
                    style={{ color: githubConnected ? 'var(--color-danger)' : 'var(--color-teal)' }}
                  >
                    {githubConnected ? 'Disconnect' : 'Connect Account'}
                  </button>
                </div>

                {/* Google */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>Google Authentication</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Login with one-click Google OAuth single sign-on credentials.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setGoogleConnected(!googleConnected); saveSettings.mutate({ connectedAccounts: { googleConnected: !googleConnected } }); }}
                    className="app-btn"
                    style={{ color: googleConnected ? 'var(--color-danger)' : 'var(--color-teal)' }}
                  >
                    {googleConnected ? 'Disconnect' : 'Connect Account'}
                  </button>
                </div>

                {/* LinkedIn */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#fff' }}>LinkedIn Profile Sync</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-app-muted)' }}>Sync career credentials for automated Resume Builder profiles.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setLinkedinConnected(!linkedinConnected); saveSettings.mutate({ connectedAccounts: { linkedinConnected: !linkedinConnected } }); }}
                    className="app-btn"
                    style={{ color: linkedinConnected ? 'var(--color-danger)' : 'var(--color-teal)' }}
                  >
                    {linkedinConnected ? 'Disconnect' : 'Connect Account'}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
