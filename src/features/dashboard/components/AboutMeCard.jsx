import { User, ArrowRight, Code2 } from 'lucide-react'

const CODE_LINES = [
  { ln: '01', parts: [{ t: 'kw', v: 'const ' }, { t: 'fn', v: 'dev' }, { t: 'punct', v: ' = {' }] },
  { ln: '02', parts: [{ t: 'prop', v: '  name' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"Nisith"' }, { t: 'punct', v: ',' }] },
  { ln: '03', parts: [{ t: 'prop', v: '  role' }, { t: 'punct', v: ': ' }, { t: 'str', v: '"FullStack"' }] },
  { ln: '04', parts: [{ t: 'punct', v: '}' }] },
]

function renderPart({ t, v }, idx) {
  return (
    <span key={idx} className={`code-${t}`} style={{ fontSize: '11px' }}>{v}</span>
  )
}

export default function AboutMeCard() {
  return (
    <div className="card" id="about-me-card" style={{ flex: '1', minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 12px !important' }}>
      <div className="card-head" style={{ marginBottom: '6px' }}>
        <h2 className="card-title" style={{ fontSize: '13px' }}>
          <User size={14} className="card-title-icon" />
          About Me
        </h2>
        <Code2 size={14} style={{ color: 'var(--color-violet-bright)', opacity: 0.6 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px', flex: 1, minHeight: 0, alignItems: 'center' }}>
        {/* Bio text */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          <p className="about-bio" style={{ fontSize: '11.5px', margin: 0, lineHeight: '1.4', color: 'var(--color-app-muted)' }}>
            I'm a Full Stack Developer building responsive web apps with clean React UIs and robust Node.js APIs backed by MongoDB and PostgreSQL.
          </p>
        </div>

        {/* Code snippet visual */}
        <div className="code-snippet" aria-label="Developer profile code snippet" style={{ margin: 0, padding: '6px 8px', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="code-snippet-header" style={{ marginBottom: '4px', paddingBottom: '4px' }}>
            <span className="code-dot red" style={{ width: '6px', height: '6px' }} />
            <span className="code-dot yellow" style={{ width: '6px', height: '6px' }} />
            <span className="code-dot green" style={{ width: '6px', height: '6px' }} />
            <span className="code-snippet-file" style={{ fontSize: '10px' }}>profile.json</span>
          </div>
          <div className="code-snippet-body" style={{ padding: 0 }}>
            {CODE_LINES.map(({ ln, parts }) => (
              <div key={ln} className="code-line" style={{ gap: '6px', lineHeight: '1.2' }}>
                <span className="code-ln" style={{ fontSize: '10px', minWidth: '10px' }}>{ln}</span>
                <span>{parts.map(renderPart)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
