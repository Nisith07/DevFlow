import { GitBranch, Users, Flame } from 'lucide-react'
import { useMemo } from 'react'

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const GH_USERNAME = 'nisith-bhowmik'
const GH_STATS = {
  repos:         42,
  followers:    128,
  following:     98,
  contributions: 512,
}

// Generate last 18 weeks contribution heatmap grid (fits container perfectly)
function generateHeatmapData() {
  const weeks = []
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - (today.getDay()) - 17 * 7)

  for (let w = 0; w < 18; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const isFuture = date > today
      const raw = isFuture ? 0 : Math.floor(Math.random() * 8)
      week.push({ date: date.toISOString().slice(0, 10), count: raw })
    }
    weeks.push(week)
  }
  return weeks
}

function getLevel(count) {
  if (count === 0) return 'l0'
  if (count <= 2)  return 'l1'
  if (count <= 4)  return 'l2'
  if (count <= 6)  return 'l3'
  return 'l4'
}

const STATS_CONFIG = [
  { key: 'repos',         label: 'Repos',        icon: GitBranch, color: 'var(--color-blue)' },
  { key: 'followers',     label: 'Followers',    icon: Users,    color: 'var(--color-violet-bright)' },
  { key: 'contributions', label: 'Contribs',     icon: Flame,    color: 'var(--color-amber)' },
]

export default function GitHubOverview() {
  const heatmapWeeks = useMemo(() => generateHeatmapData(), [])

  return (
    <div className="card" id="github-overview-card" style={{ flex: '1.2', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="card-head">
        <h2 className="card-title">
          <GithubIcon size={14} />
          GitHub Overview
        </h2>
        <a
          href={`https://github.com/${GH_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '10px', color: 'var(--color-violet-bright)', fontWeight: 500 }}
        >
          @{GH_USERNAME}
        </a>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {STATS_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <div
            key={key}
            className="neu-inset"
            style={{
              borderRadius: '6px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontWeight: 'bold', color, lineHeight: '1.2' }}>
              {GH_STATS[key]}
            </span>
            <span style={{ color: 'var(--color-app-muted)', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
              <Icon size={9} />
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--color-app-muted)', marginBottom: '4px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Flame size={10} style={{ color: 'var(--color-amber)' }} />
            <span>{GH_STATS.contributions} contributions</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {['l0','l1','l2','l3','l4'].map((l) => (
                <div key={l} className={`heatmap-cell ${l}`} style={{ borderRadius: '1.5px' }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div style={{ display: 'flex', gap: '4px', alignSelf: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '8px', color: 'var(--color-app-faint)', height: '56px', paddingRight: '2px' }}>
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>
          <div className="heatmap-grid" style={{ display: 'flex', gap: '2.5px', overflow: 'hidden' }}>
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
                {week.map(({ date, count }) => (
                  <div
                    key={date}
                    className={`heatmap-cell ${getLevel(count)}`}
                    title={`${date}: ${count} commits`}
                    style={{ borderRadius: '1.5px', transition: 'background 0.2s' }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
