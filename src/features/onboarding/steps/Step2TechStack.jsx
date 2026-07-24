import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

const TECH_CATEGORIES = [
  {
    label: 'Frontend',
    color: '#3B82F6',
    items: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Astro', 'Remix'],
  },
  {
    label: 'Backend',
    color: '#10B981',
    items: ['Node.js', 'Express', 'Django', 'FastAPI', 'Spring Boot', 'Laravel', 'NestJS', 'Rails'],
  },
  {
    label: 'Languages',
    color: '#F59E0B',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C#', 'Rust', 'PHP', 'Kotlin', 'Swift'],
  },
  {
    label: 'Database',
    color: '#8B5CF6',
    items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Supabase', 'PlanetScale'],
  },
  {
    label: 'Cloud & Deploy',
    color: '#EC4899',
    items: ['AWS', 'Azure', 'GCP', 'Vercel', 'Render', 'Railway', 'Netlify', 'Fly.io', 'Docker'],
  },
]

export default function Step2TechStack({ data, onChange }) {
  const [query, setQuery] = useState('')
  const selected = data.techStack || []

  const toggle = (item) => {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item]
    onChange({ techStack: next })
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return TECH_CATEGORIES
    const q = query.toLowerCase()
    return TECH_CATEGORIES
      .map((cat) => ({ ...cat, items: cat.items.filter((i) => i.toLowerCase().includes(q)) }))
      .filter((cat) => cat.items.length > 0)
  }, [query])

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 2 of 9</div>
      <h2 className="ob-step-title">Your Tech Stack</h2>
      <p className="ob-step-sub">What technologies do you use? The AI will understand your environment.</p>

      <div className="ob-search-wrap">
        <Search size={15} className="ob-search-icon" />
        <input
          className="ob-search-input"
          type="text"
          placeholder="Search technologies…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="ob-stack-categories">
        {filtered.map((cat) => (
          <div key={cat.label} className="ob-stack-category">
            <div className="ob-stack-cat-label" style={{ color: cat.color }}>{cat.label}</div>
            <div className="ob-chip-row">
              {cat.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`ob-chip ${selected.includes(item) ? 'ob-chip--active' : ''}`}
                  onClick={() => toggle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="ob-selected-summary">
          <span className="ob-selected-label">Selected ({selected.length}):</span>
          {selected.map((s) => (
            <span key={s} className="ob-chip ob-chip--active ob-chip--sm">{s}</span>
          ))}
        </div>
      )}
    </div>
  )
}
