import { GitBranch, Users, UserCheck, Flame, ArrowRight } from 'lucide-react'
import { useMemo } from 'react'

/** Inline GitHub SVG (lucide-react v1.x does not export Github) */
const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

/* ─── GitHub data (structured for future API integration) ─────────
   Replace these constants with a useGitHubStats() hook once you
   wire up the GitHub REST/GraphQL API.
   ─────────────────────────────────────────────────────────────── */
const GH_USERNAME = 'nisith-bhowmik'
const GH_STATS = {
  repos:         42,
  followers:    128,
  following:     98,
  contributions: 512,
}

/** Generate a simulated 52-week heatmap grid (for visual purposes).
 *  Replace with real contribution data from the GitHub API when available.
 */
function generateHeatmapData() {
  const weeks = []
  const today = new Date()
  // go back 52 weeks from the most recent Sunday
  const start = new Date(today)
  start.setDate(today.getDate() - (today.getDay()) - 52 * 7)

  for (let w = 0; w < 52; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const isFuture = date > today
      const raw = isFuture ? 0 : Math.floor(Math.random() * 12)
      week.push({ date: date.toISOString().slice(0, 10), count: raw })
    }
    weeks.push(week)
  }
  return weeks
}

function getLevel(count) {
  if (count === 0) return 'l0'
  if (count <= 2)  return 'l1'
  if (count <= 5)  return 'l2'
  if (count <= 9)  return 'l3'
  return 'l4'
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS   = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const STATS_CONFIG = [
  { key: 'repos',         label: 'Repos',         icon: GitBranch, color: 'var(--color-blue)' },
  { key: 'followers',     label: 'Followers',      icon: Users,    color: 'var(--color-violet-bright)' },
  { key: 'following',     label: 'Following',      icon: UserCheck,color: 'var(--color-green)' },
  { key: 'contributions', label: 'Contributions',  icon: Flame,    color: 'var(--color-amber)' },
]

export default function GitHubOverview() {
  const heatmapWeeks = useMemo(() => generateHeatmapData(), [])

  // Month labels — figure out which week each month starts
  const monthPositions = useMemo(() => {
    const seen = new Set()
    const positions = []
    heatmapWeeks.forEach((week, wi) => {
      const month = new Date(week[0].date).getMonth()
      if (!seen.has(month)) {
        seen.add(month)
        positions.push({ wi, label: MONTH_LABELS[month] })
      }
    })
    return positions
  }, [heatmapWeeks])

  return (
    <div className="card" id="github-overview-card">
      {/* Header */}
      <div className="card-head">
        <h2 className="card-title">
          <GithubIcon size={13} />
          GitHub Overview
        </h2>
        <a
          href={`https://github.com/${GH_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-view-btn"
          id="github-view-profile-btn"
          aria-label="View GitHub profile"
        >
          View Profile
          <ArrowRight size={12} />
        </a>
      </div>

      {/* User row */}
      <div className="github-user-row">
        <div className="github-avatar-sm">
          <GithubIcon size={16} style={{ color: 'var(--color-app-muted)' }} />
        </div>
        <div>
          <div className="github-username">Nisith Bhowmik</div>
          <div className="github-handle">@{GH_USERNAME}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="github-stats-row">
        {STATS_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="github-stat" id={`github-stat-${key}`}>
            <span className="github-stat-val" style={{ color }}>
              {GH_STATS[key]}
            </span>
            <div className="github-stat-label">
              <Icon size={10} />
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="heatmap-section">
        <div className="heatmap-header">
          <span className="heatmap-label">
            <Flame size={12} style={{ color: 'var(--color-amber)' }} />
            <span className="heatmap-contrib-count">{GH_STATS.contributions}</span>
            contributions in the last year
          </span>
          <div className="heatmap-legend">
            Less
            <div className="heatmap-legend-cells">
              {['l0','l1','l2','l3','l4'].map((l) => (
                <div key={l} className={`heatmap-legend-cell heatmap-cell ${l}`} />
              ))}
            </div>
            More
          </div>
        </div>

        {/* Month labels */}
        <div className="heatmap-months" style={{ paddingLeft: 20 }}>
          {monthPositions.map(({ wi, label }, i) => (
            <span
              key={i}
              className="heatmap-month"
              style={{ flex: 'none', width: 'auto', minWidth: 24, marginLeft: wi === 0 ? 0 : `${(monthPositions[i].wi - (monthPositions[i - 1]?.wi ?? 0)) * 12}px` }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="heatmap-grid-wrap">
          {/* Day labels */}
          <div className="heatmap-day-labels">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="heatmap-day-label" style={{ height: 12 }}>
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="heatmap-grid" style={{ overflowX: 'auto' }}>
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map(({ date, count }) => (
                  <div
                    key={date}
                    className={`heatmap-cell ${getLevel(count)}`}
                    title={`${date}: ${count} contribution${count !== 1 ? 's' : ''}`}
                    aria-label={`${date}: ${count} contributions`}
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
