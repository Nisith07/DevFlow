import { Briefcase, FileText, Code2, GitBranch } from 'lucide-react'

export default function Step4Project({ data, onChange }) {
  const proj = data.mainProject || {}

  const set = (key, val) => onChange({ mainProject: { ...proj, [key]: val } })

  return (
    <div className="ob-step-content">
      <div className="ob-step-eyebrow">Step 3 of 5</div>
      <h2 className="ob-step-title">What are you building?</h2>
      <p className="ob-step-sub">Tell us about your main project — this becomes your first AI Memory.</p>

      <div className="ob-project-form">
        <label className="ob-field">
          <span className="ob-field-label">
            <Briefcase size={14} /> Project Name
          </span>
          <input
            className="ob-input"
            type="text"
            placeholder="e.g. DevFlow"
            value={proj.name || ''}
            onChange={(e) => set('name', e.target.value)}
          />
        </label>

        <label className="ob-field">
          <span className="ob-field-label">
            <FileText size={14} /> Description
          </span>
          <textarea
            className="ob-input ob-textarea"
            placeholder="e.g. An AI-powered developer operating system."
            value={proj.description || ''}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
          />
        </label>

        <label className="ob-field">
          <span className="ob-field-label">
            <Code2 size={14} /> Framework / Stack
          </span>
          <input
            className="ob-input"
            type="text"
            placeholder="e.g. React + Node.js + MongoDB"
            value={proj.framework || ''}
            onChange={(e) => set('framework', e.target.value)}
          />
        </label>

        <label className="ob-field">
          <span className="ob-field-label">
            <GitBranch size={14} /> Repository URL
          </span>
          <input
            className="ob-input"
            type="url"
            placeholder="github.com/your-username/your-repo"
            value={proj.repository || ''}
            onChange={(e) => set('repository', e.target.value)}
          />
        </label>
      </div>

      <div className="ob-ai-memory-pill">
        🧠 This will seed your <strong>AI Project Memory</strong>
      </div>
    </div>
  )
}
