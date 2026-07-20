import { useState, useEffect } from 'react'
import {
  FileText, Sparkles, Printer, User, Briefcase, GraduationCap, Code, CheckSquare, Plus, Trash2, Import, ClipboardList
} from 'lucide-react'
import PageHeader from '@/shared/components/PageHeader'
import {
  useResumeData,
  useSaveResumeData,
  useAIImproveResume,
  useAISkillsSuggestions,
  useImportLinkedIn
} from './hooks/useResume'
import LoadingSpinner from '@/shared/components/LoadingSpinner'

export default function ResumePage() {
  const { data: resume, isLoading } = useResumeData()
  const saveResume = useSaveResumeData()
  const improveText = useAIImproveResume()
  const suggestSkills = useAISkillsSuggestions()
  const importProfile = useImportLinkedIn()

  // Form edit states
  const [activeFormTab, setActiveFormTab] = useState('personal') // personal, experience, education, projects, skills
  const [personal, setPersonal] = useState({ name: '', title: '', email: '', phone: '', website: '', github: '', linkedin: '', summary: '' })
  const [experience, setExperience] = useState([])
  const [education, setEducation] = useState([])
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [template, setTemplate] = useState('classic')

  // LinkedIn Import state
  const [linkedinText, setLinkedinText] = useState('')
  const [showImportArea, setShowImportArea] = useState(false)
  const [isImprovingIndex, setIsImprovingIndex] = useState(null) // tracks active experience index being optimized

  useEffect(() => {
    if (resume) {
      setPersonal(resume.personalInfo || { name: '', title: '', email: '', phone: '', website: '', github: '', linkedin: '', summary: '' })
      setExperience(resume.experience || [])
      setEducation(resume.education || [])
      setProjects(resume.projects || [])
      setSkills(resume.skills || [])
      setTemplate(resume.template || 'classic')
    }
  }, [resume])

  // Save debounce helper or direct trigger
  const handlePersist = async (newObj) => {
    try {
      await saveResume.mutateAsync({
        personalInfo: newObj.personal || personal,
        experience: newObj.experience || experience,
        education: newObj.education || education,
        projects: newObj.projects || projects,
        skills: newObj.skills || skills,
        template: newObj.template || template
      })
    } catch (err) {
      console.error('Failed to save resume updates:', err)
    }
  }

  // Personal Info Changes
  const handlePersonalChange = (field, val) => {
    const updated = { ...personal, [field]: val }
    setPersonal(updated)
    handlePersist({ personal: updated })
  }

  // Experience CRUD
  const handleAddExperience = () => {
    const updated = [...experience, { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }]
    setExperience(updated)
    handlePersist({ experience: updated })
  }

  const handleUpdateExperience = (idx, field, val) => {
    const updated = [...experience]
    updated[idx] = { ...updated[idx], [field]: val }
    setExperience(updated)
    handlePersist({ experience: updated })
  }

  const handleDeleteExperience = (idx) => {
    const updated = experience.filter((_, i) => i !== idx)
    setExperience(updated)
    handlePersist({ experience: updated })
  }

  // AI Improve Experience description
  const handleAIImproveExperience = async (idx) => {
    const text = experience[idx].description
    if (!text.trim()) return
    setIsImprovingIndex(idx)
    try {
      const optimized = await improveText.mutateAsync(text)
      handleUpdateExperience(idx, 'description', optimized)
    } catch (err) {
      alert('Failed to optimize description block.')
    } finally {
      setIsImprovingIndex(null)
    }
  }

  // Education CRUD
  const handleAddEducation = () => {
    const updated = [...education, { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }]
    setEducation(updated)
    handlePersist({ education: updated })
  }

  const handleUpdateEducation = (idx, field, val) => {
    const updated = [...education]
    updated[idx] = { ...updated[idx], [field]: val }
    setEducation(updated)
    handlePersist({ education: updated })
  }

  const handleDeleteEducation = (idx) => {
    const updated = education.filter((_, i) => i !== idx)
    setEducation(updated)
    handlePersist({ education: updated })
  }

  // Projects CRUD
  const handleAddProject = () => {
    const updated = [...projects, { name: '', description: '', technologies: [], url: '' }]
    setProjects(updated)
    handlePersist({ projects: updated })
  }

  const handleUpdateProject = (idx, field, val) => {
    const updated = [...projects]
    if (field === 'technologies') {
      updated[idx] = { ...updated[idx], [field]: val.split(',').map(s => s.trim()).filter(Boolean) }
    } else {
      updated[idx] = { ...updated[idx], [field]: val }
    }
    setProjects(updated)
    handlePersist({ projects: updated })
  }

  const handleDeleteProject = (idx) => {
    const updated = projects.filter((_, i) => i !== idx)
    setProjects(updated)
    handlePersist({ projects: updated })
  }

  // Skills handlers
  const handleAddSkillTag = (tag) => {
    if (!tag.trim() || skills.includes(tag.trim())) return
    const updated = [...skills, tag.trim()]
    setSkills(updated)
    handlePersist({ skills: updated })
  }

  const handleDeleteSkill = (idx) => {
    const updated = skills.filter((_, i) => i !== idx)
    setSkills(updated)
    handlePersist({ skills: updated })
  }

  // AI Skills suggestions
  const [suggestedTags, setSuggestedTags] = useState([])
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)

  const handleSuggestSkills = async () => {
    setIsGeneratingSkills(true)
    try {
      const tags = await suggestSkills.mutateAsync({ title: personal.title, summary: personal.summary })
      setSuggestedTags(tags)
    } catch (err) {
      alert('Failed to generate skill suggestions.')
    } finally {
      setIsGeneratingSkills(false)
    }
  }

  // Import LinkedIn profile text
  const handleImportLinkedIn = async (e) => {
    e.preventDefault()
    if (!linkedinText.trim()) return
    try {
      await importProfile.mutateAsync(linkedinText.trim())
      setLinkedinText('')
      setShowImportArea(false)
    } catch (err) {
      alert('Failed to parse LinkedIn text.')
    }
  }

  // Export PDF (triggers window print layout for the resume container)
  const handlePrintResume = () => {
    window.print()
  }

  if (isLoading) {
    return <LoadingSpinner size={40} />
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
        title="Resume Builder"
        subtitle="Live resume builder optimized to generate clean, ATS-compliant software developer resumes."
        action={
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="app-btn" onClick={() => setShowImportArea(!showImportArea)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Import size={15} />
              <span>Import LinkedIn</span>
            </button>
            <button className="app-btn primary" onClick={handlePrintResume} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Printer size={15} />
              <span>Export PDF</span>
            </button>
          </div>
        }
      />

      {/* LinkedIn Import paste area drawer */}
      {showImportArea && (
        <div className="card" style={{ background: 'var(--color-app-surface)', border: '1px solid var(--color-teal)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '800', color: 'var(--color-teal)' }}>Paste LinkedIn Profile Export Text</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '11.5px', color: 'var(--color-app-muted)' }}>
            Paste raw text from a LinkedIn PDF export or copy-paste your profile text. The AI will parse it and auto-fill all form categories.
          </p>
          <form onSubmit={handleImportLinkedIn} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <textarea
              rows={4}
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              placeholder="Paste raw profile text here..."
              required
              style={{
                padding: '10px',
                background: 'var(--color-app-bg)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12.5px',
                outline: 'none',
                fontFamily: 'monospace'
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="app-btn" onClick={() => setShowImportArea(false)}>Cancel</button>
              <button type="submit" className="app-btn primary" disabled={importProfile.isPending}>
                {importProfile.isPending ? 'Parsing Profile...' : 'AI Import'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Workspace grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        
        {/* LEFT COLUMN: Input Forms Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--color-app-surface)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 14, overflow: 'hidden' }}>
          {/* Sub Tab buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: 'var(--color-app-bg)', borderBottom: '1px solid var(--color-app-border)' }}>
            <button onClick={() => setActiveFormTab('personal')} style={{ padding: '12px 6px', border: 'none', background: activeFormTab === 'personal' ? 'var(--color-app-surface)' : 'transparent', color: activeFormTab === 'personal' ? 'var(--color-teal)' : 'var(--color-app-faint)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Info</button>
            <button onClick={() => setActiveFormTab('experience')} style={{ padding: '12px 6px', border: 'none', background: activeFormTab === 'experience' ? 'var(--color-app-surface)' : 'transparent', color: activeFormTab === 'experience' ? 'var(--color-teal)' : 'var(--color-app-faint)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Work</button>
            <button onClick={() => setActiveFormTab('education')} style={{ padding: '12px 6px', border: 'none', background: activeFormTab === 'education' ? 'var(--color-app-surface)' : 'transparent', color: activeFormTab === 'education' ? 'var(--color-teal)' : 'var(--color-app-faint)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Edu</button>
            <button onClick={() => setActiveFormTab('projects')} style={{ padding: '12px 6px', border: 'none', background: activeFormTab === 'projects' ? 'var(--color-app-surface)' : 'transparent', color: activeFormTab === 'projects' ? 'var(--color-teal)' : 'var(--color-app-faint)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Projects</button>
            <button onClick={() => setActiveFormTab('skills')} style={{ padding: '12px 6px', border: 'none', background: activeFormTab === 'skills' ? 'var(--color-app-surface)' : 'transparent', color: activeFormTab === 'skills' ? 'var(--color-teal)' : 'var(--color-app-faint)', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Skills</button>
          </div>

          {/* Form scroll pane */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* 1. PERSONAL INFORMATION */}
            {activeFormTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Full Name</label>
                  <input type="text" value={personal.name} onChange={(e) => handlePersonalChange('name', e.target.value)} style={selectStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Professional Title</label>
                  <input type="text" value={personal.title} onChange={(e) => handlePersonalChange('title', e.target.value)} placeholder="e.g. Senior Frontend Engineer" style={selectStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Email Address</label>
                    <input type="email" value={personal.email} onChange={(e) => handlePersonalChange('email', e.target.value)} style={selectStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Phone Number</label>
                    <input type="text" value={personal.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} style={selectStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Personal Website / Portfolio</label>
                  <input type="text" value={personal.website} onChange={(e) => handlePersonalChange('website', e.target.value)} style={selectStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>GitHub URL</label>
                    <input type="text" value={personal.github} onChange={(e) => handlePersonalChange('github', e.target.value)} style={selectStyle} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>LinkedIn URL</label>
                    <input type="text" value={personal.linkedin} onChange={(e) => handlePersonalChange('linkedin', e.target.value)} style={selectStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: '11px', color: 'var(--color-app-muted)', fontWeight: 'bold' }}>Summary Profile</label>
                  <textarea rows={4} value={personal.summary} onChange={(e) => handlePersonalChange('summary', e.target.value)} placeholder="Write a short ATS summary describing your developer expertise..." style={{ ...selectStyle, resize: 'none' }} />
                </div>
              </div>
            )}

            {/* 2. WORK EXPERIENCE */}
            {activeFormTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)' }}>Positions List ({experience.length})</span>
                  <button className="app-btn" onClick={handleAddExperience} style={{ padding: '4px 10px', fontSize: '11px' }}>+ Add Work</button>
                </div>

                {experience.map((exp, idx) => (
                  <div key={idx} style={{ padding: '14px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                    <button onClick={() => handleDeleteExperience(idx)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Company Name</label>
                        <input type="text" value={exp.company} onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)} style={selectStyle} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Job Title</label>
                        <input type="text" value={exp.position} onChange={(e) => handleUpdateExperience(idx, 'position', e.target.value)} style={selectStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Start Date</label>
                        <input type="text" value={exp.startDate} placeholder="e.g. June 2022" onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)} style={selectStyle} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>End Date</label>
                        <input type="text" value={exp.endDate} placeholder="e.g. Present" disabled={exp.current} onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)} style={selectStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="checkbox" checked={exp.current} onChange={(e) => handleUpdateExperience(idx, 'current', e.target.checked)} style={{ width: 14, height: 14 }} />
                      <label style={{ fontSize: '12px', color: 'var(--color-app-text)' }}>Currently working here</label>
                    </div>

                    {/* Description with AI Improve Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>ATS Highlights / Description</label>
                        <button
                          type="button"
                          disabled={isImprovingIndex === idx || !exp.description.trim()}
                          onClick={() => handleAIImproveExperience(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-teal)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}
                        >
                          {isImprovingIndex === idx ? (
                            <LoaderCircle size={10} className="auth-spinner" />
                          ) : (
                            <Sparkles size={10} style={{ color: 'var(--color-amber)' }} />
                          )}
                          <span>AI ATS Optimize</span>
                        </button>
                      </div>
                      <textarea rows={3} value={exp.description} onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)} placeholder="Describe your achievements and impact..." style={{ ...selectStyle, resize: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. EDUCATION */}
            {activeFormTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)' }}>Education List</span>
                  <button className="app-btn" onClick={handleAddEducation} style={{ padding: '4px 10px', fontSize: '11px' }}>+ Add Education</button>
                </div>

                {education.map((edu, idx) => (
                  <div key={idx} style={{ padding: '14px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                    <button onClick={() => handleDeleteEducation(idx)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>School / University</label>
                      <input type="text" value={edu.institution} onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)} style={selectStyle} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Degree</label>
                        <input type="text" value={edu.degree} placeholder="e.g. Bachelor" onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)} style={selectStyle} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Field of Study</label>
                        <input type="text" value={edu.fieldOfStudy} placeholder="e.g. Computer Science" onChange={(e) => handleUpdateEducation(idx, 'fieldOfStudy', e.target.value)} style={selectStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Start Date</label>
                        <input type="text" value={edu.startDate} onChange={(e) => handleUpdateEducation(idx, 'startDate', e.target.value)} style={selectStyle} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>End Date</label>
                        <input type="text" value={edu.endDate} onChange={(e) => handleUpdateEducation(idx, 'endDate', e.target.value)} style={selectStyle} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. PROJECTS */}
            {activeFormTab === 'projects' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)' }}>Projects List</span>
                  <button className="app-btn" onClick={handleAddProject} style={{ padding: '4px 10px', fontSize: '11px' }}>+ Add Project</button>
                </div>

                {projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: '14px', background: 'var(--color-app-bg)', border: '1px solid var(--color-app-border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                    <button onClick={() => handleDeleteProject(idx)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Project Title</label>
                        <input type="text" value={proj.name} onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)} style={selectStyle} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>URL link</label>
                        <input type="text" value={proj.url} onChange={(e) => handleUpdateProject(idx, 'url', e.target.value)} style={selectStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Technologies (comma separated)</label>
                      <input type="text" value={(proj.technologies || []).join(', ')} onChange={(e) => handleUpdateProject(idx, 'technologies', e.target.value)} placeholder="e.g. React, MongoDB, Vite" style={selectStyle} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: '10px', color: 'var(--color-app-muted)' }}>Description Highlights</label>
                      <textarea rows={2} value={proj.description} onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)} style={{ ...selectStyle, resize: 'none' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. SKILLS & RECOMMENDATIONS */}
            {activeFormTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)' }}>Skills Checklist</span>
                
                {/* Custom Skill tag input */}
                <input
                  type="text"
                  placeholder="Type skill and press Enter (e.g. React)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkillTag(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                  style={selectStyle}
                />

                {/* Skills tags list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0' }}>
                  {skills.map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--color-app-text)', padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>{skill}</span>
                      <button onClick={() => handleDeleteSkill(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0, fontSize: '9px', fontWeight: 'bold' }}>&times;</button>
                    </span>
                  ))}
                </div>

                {/* Suggest skills section */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
                  <button
                    className="app-btn"
                    disabled={isGeneratingSkills || !personal.title}
                    onClick={handleSuggestSkills}
                    style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {isGeneratingSkills ? (
                      <>
                        <LoaderCircle size={13} className="auth-spinner" />
                        <span>Generating recommendations...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} style={{ color: 'var(--color-amber)' }} />
                        <span>AI Suggest Skills</span>
                      </>
                    )}
                  </button>

                  {suggestedTags.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--color-app-faint)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Click to add skills suggestion:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {suggestedTags.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddSkillTag(tag)}
                            disabled={skills.includes(tag)}
                            style={{
                              fontSize: '10px',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: '1px solid rgba(79, 184, 168, 0.2)',
                              background: skills.includes(tag) ? 'transparent' : 'rgba(79, 184, 168, 0.05)',
                              color: skills.includes(tag) ? 'var(--color-app-faint)' : 'var(--color-teal)',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Template select row */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--color-app-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-app-bg)' }}>
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-app-muted)' }}>Template Style</span>
            <select
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value)
                handlePersist({ template: e.target.value })
              }}
              style={{
                width: '130px',
                padding: '6px 10px',
                background: 'var(--color-app-surface)',
                border: '1px solid var(--color-app-border)',
                borderRadius: '6px',
                color: 'var(--color-app-text)',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="classic">Classic (Serif) 🖋️</option>
              <option value="modern">Modern (Accent) 🌟</option>
              <option value="minimalist">Minimalist 🕊️</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: Live A4 PDF Print Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {/* Scroll view wrapper around paper preview */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#090d16', border: '1px solid var(--color-app-border)', borderRadius: 14, display: 'flex', justifyContent: 'center', padding: '30px 10px' }}>
            
            {/* A4 Paper canvas document */}
            <div
              id="resume-pdf-print-area"
              style={{
                width: '210mm',
                minHeight: '297mm',
                background: '#ffffff',
                color: '#111827',
                padding: '24mm 20mm',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                fontFamily: template === 'classic' ? 'Georgia, serif' : 'system-ui, sans-serif',
                fontSize: '12.5px',
                lineHeight: 1.5,
                boxSizing: 'border-box'
              }}
            >
              {/* HEADER SECTION */}
              <div style={{
                textAlign: template === 'classic' ? 'center' : 'left',
                borderBottom: template === 'minimalist' ? '1px solid #e5e7eb' : 'none',
                paddingBottom: template === 'minimalist' ? '16px' : '0px',
                marginBottom: '20px'
              }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase', color: '#111827', letterSpacing: '0.04em' }}>
                  {personal.name || 'Your Full Name'}
                </h1>
                <p style={{ fontSize: '13px', fontWeight: 'bold', color: template === 'modern' ? '#0f766e' : '#4b5563', margin: '0 0 10px 0' }}>
                  {personal.title || 'Professional Software Developer'}
                </p>
                
                {/* Contact grid details */}
                <div style={{
                  display: 'flex',
                  justifyContent: template === 'classic' ? 'center' : 'flex-start',
                  flexWrap: 'wrap',
                  gap: '8px 14px',
                  fontSize: '11.5px',
                  color: '#4b5563',
                  fontWeight: '500'
                }}>
                  {personal.email && <span>{personal.email}</span>}
                  {personal.phone && <span>{personal.phone}</span>}
                  {personal.website && <span>{personal.website}</span>}
                  {personal.github && <span>GitHub: {personal.github.replace(/https?:\/\/(www\.)?github\.com\//, '')}</span>}
                  {personal.linkedin && <span>LinkedIn: {personal.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
                </div>
              </div>

              {/* SUMMARY SECTION */}
              {personal.summary && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '13.5px', fontWeight: 'bold', textTransform: 'uppercase',
                    color: template === 'modern' ? '#0f766e' : '#111827',
                    borderBottom: template === 'modern' ? '2px solid #0f766e' : '1px solid #111827',
                    paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.05em'
                  }}>Summary</h3>
                  <p style={{ margin: 0, color: '#374151', fontSize: '12px', textAlign: 'justify' }}>{personal.summary}</p>
                </div>
              )}

              {/* EXPERIENCE SECTION */}
              {experience.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '13.5px', fontWeight: 'bold', textTransform: 'uppercase',
                    color: template === 'modern' ? '#0f766e' : '#111827',
                    borderBottom: template === 'modern' ? '2px solid #0f766e' : '1px solid #111827',
                    paddingBottom: '3px', marginBottom: '10px', letterSpacing: '0.05em'
                  }}>Professional Experience</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {experience.map((exp, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px' }}>
                          <span>{exp.position} &ndash; <span style={{ color: '#4b5563' }}>{exp.company}</span></span>
                          <span style={{ color: '#4b5563', fontSize: '11px', fontWeight: 'normal' }}>{exp.startDate} &ndash; {exp.current ? 'Present' : exp.endDate}</span>
                        </div>
                        {exp.description && (
                          <p style={{ margin: '2px 0 0 0', color: '#374151', fontSize: '11.5px', whiteSpace: 'pre-line', paddingLeft: '8px', borderLeft: '2px solid #e5e7eb' }}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS SECTION */}
              {projects.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '13.5px', fontWeight: 'bold', textTransform: 'uppercase',
                    color: template === 'modern' ? '#0f766e' : '#111827',
                    borderBottom: template === 'modern' ? '2px solid #0f766e' : '1px solid #111827',
                    paddingBottom: '3px', marginBottom: '10px', letterSpacing: '0.05em'
                  }}>Selected Projects</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {projects.map((proj, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px' }}>
                          <span>{proj.name}</span>
                          {proj.url && <span style={{ fontSize: '10.5px', fontWeight: 'normal', color: '#0f766e' }}>{proj.url}</span>}
                        </div>
                        {proj.technologies?.length > 0 && (
                          <div style={{ fontSize: '10.5px', color: '#4b5563', margin: '2px 0', fontWeight: '600' }}>
                            Technologies: {proj.technologies.join(', ')}
                          </div>
                        )}
                        <p style={{ margin: '2px 0 0 0', color: '#374151', fontSize: '11.5px' }}>{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EDUCATION SECTION */}
              {education.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '13.5px', fontWeight: 'bold', textTransform: 'uppercase',
                    color: template === 'modern' ? '#0f766e' : '#111827',
                    borderBottom: template === 'modern' ? '2px solid #0f766e' : '1px solid #111827',
                    paddingBottom: '3px', marginBottom: '10px', letterSpacing: '0.05em'
                  }}>Education</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {education.map((edu, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div>
                          <strong>{edu.institution}</strong> &ndash; <span style={{ italic: 'true' }}>{edu.degree} in {edu.fieldOfStudy}</span>
                        </div>
                        <span style={{ color: '#4b5563', fontSize: '11px' }}>{edu.startDate} &ndash; {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS SECTION */}
              {skills.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '13.5px', fontWeight: 'bold', textTransform: 'uppercase',
                    color: template === 'modern' ? '#0f766e' : '#111827',
                    borderBottom: template === 'modern' ? '2px solid #0f766e' : '1px solid #111827',
                    paddingBottom: '3px', marginBottom: '8px', letterSpacing: '0.05em'
                  }}>Technical Skills</h3>
                  <p style={{ margin: 0, color: '#374151', fontSize: '12px', fontWeight: '500' }}>
                    {skills.join(', ')}
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
