import { getGitHubOAuthUrl } from '../hooks/useGitHub'

const Github = ({ size = 32, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

export default function TokenSetup() {
  const handleConnect = () => {
    window.location.href = getGitHubOAuthUrl()
  }

  return (
    <div style={{ maxWidth: '520px', margin: '60px auto', padding: '0 16px' }}>
      {/* Card */}
      <div style={{
        background: 'var(--color-app-surface)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '72px', height: '72px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #24292e 0%, #1a1f24 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '24px', color: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          <Github size={36} />
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 10px', color: 'var(--color-app-text)' }}>
          Connect GitHub
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--color-app-muted)', margin: '0 0 32px', lineHeight: 1.7, maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto' }}>
          Import repositories, sync projects, and manage your entire development workflow directly inside DevFlow.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
          {[
            ['🔀', 'View branches, commits, and pull requests'],
            ['📦', 'Browse and create repositories'],
            ['🚀', 'Track releases and deployment activity'],
            ['🔒', 'Secure OAuth — no tokens to paste'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px' }}>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span style={{ fontSize: '12.5px', color: 'var(--color-app-text)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Connect button */}
        <button
          onClick={handleConnect}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            padding: '13px 24px',
            background: 'linear-gradient(135deg, #24292e 0%, #1a1f24 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #2d333b 0%, #22272e 100%)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #24292e 0%, #1a1f24 100%)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
          }}
        >
          <Github size={18} />
          Continue with GitHub
        </button>

        <p style={{ fontSize: '11px', color: 'var(--color-app-faint)', marginTop: '16px', lineHeight: 1.5 }}>
          You'll be redirected to GitHub to authorize DevFlow. We only request <strong style={{ color: 'var(--color-app-muted)' }}>repo</strong> and <strong style={{ color: 'var(--color-app-muted)' }}>read:user</strong> scopes.
        </p>
      </div>
    </div>
  )
}
