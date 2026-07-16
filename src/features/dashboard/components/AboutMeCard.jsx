import { User, ArrowRight, Code2 } from 'lucide-react'

const CODE_LINES = [
  { ln: '01', parts: [{ t: 'kw', v: 'const ' }, { t: 'fn', v: 'nisith' }, { t: 'punct', v: ' = {' }] },
  { ln: '02', parts: [{ t: 'prop', v: '  name' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"Nisith Bhowmik"' }, { t: 'punct', v: ',' }] },
  { ln: '03', parts: [{ t: 'prop', v: '  role' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"Full Stack Developer"' }, { t: 'punct', v: ',' }] },
  { ln: '04', parts: [{ t: 'prop', v: '  focus' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"Modern Web Applications"' }, { t: 'punct', v: ',' }] },
  { ln: '05', parts: [{ t: 'prop', v: '  passion' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"Building impactful' }] },
  { ln: '06', parts: [{ t: 'str', v: '          applications"' }, { t: 'punct', v: ',' }] },
  { ln: '07', parts: [{ t: 'punct', v: '};' }] },
]

function renderPart({ t, v }, idx) {
  return (
    <span key={idx} className={`code-${t}`}>{v}</span>
  )
}

export default function AboutMeCard() {
  return (
    <div className="card" id="about-me-card">
      <div className="card-head">
        <h2 className="card-title">
          <User size={13} className="card-title-icon" />
          About Me
        </h2>
        <Code2 size={15} style={{ color: 'var(--color-violet-bright)', opacity: 0.6 }} />
      </div>

      <div className="about-grid">
        {/* Bio text */}
        <div>
          <p className="about-bio">
            I'm a passionate Full Stack Developer who loves building modern, responsive and
            user-friendly web applications. I enjoy turning ideas into reality using code —
            from clean React UIs to robust Node.js APIs backed by MongoDB and PostgreSQL.
          </p>
          <a
            href="#"
            className="about-view-btn"
            id="view-full-profile-btn"
            aria-label="View full profile"
          >
            View Full Profile
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Code snippet visual */}
        <div className="code-snippet" aria-label="Developer profile code snippet">
          <div className="code-snippet-header">
            <span className="code-dot red" />
            <span className="code-dot yellow" />
            <span className="code-dot green" />
            <span className="code-snippet-file">nisith.js</span>
          </div>
          <div className="code-snippet-body">
            {CODE_LINES.map(({ ln, parts }) => (
              <div key={ln} className="code-line">
                <span className="code-ln">{ln}</span>
                <span>{parts.map(renderPart)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
