import { useState, useEffect, useRef } from 'react'
import {
  Check,
  Circle,
  AlertTriangle,
  Bug,
  Clock,
  Play,
  Pause,
  Bell,
  GitCommit,
  Sparkles,
  X,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import Navbar from './Navbar'
import LoginModal from './LoginModal'

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`

const APP_STYLES = `:root{  --lp-bg:#FBF7F0; --lp-surface:#FFFFFF; --lp-ink:#221D17; --lp-muted:#746B5E;  --lp-faint:#A79C8B; --lp-line:#E8E0D1; --lp-accent:#C2632F; --lp-accent-deep:#9A4B23;  --lp-accent-soft:#F3E0C9; --lp-accent-soft-line:#E7C79E; --lp-radius:14px; --lp-maxw:1120px;  --bg:#14171C; --surface:#1B1F26; --surface-hover:#21262F; --border:#2A2F38;  --text:#E8E6E1; --text-muted:#8B92A0; --text-faint:#565D6B;  --amber:#E8A33D; --amber-dim:#4A3A1E; --teal:#4FB8A8; --teal-dim:#1D3A35;  --red:#E2574C; --red-dim:#3D2220;}*{box-sizing:border-box;}.app-shell{font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased;}.app-shell a{text-decoration:none; color:inherit;}.app-shell img,.app-shell svg{display:block;}.app-view{animation:viewFade .4s ease;}@keyframes viewFade{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);}}@media (prefers-reduced-motion: reduce){ .app-view{animation:none;} }  .lp-root{background:var(--lp-bg); color:var(--lp-ink); line-height:1.5;}.lp-mono{font-family:'JetBrains Mono',monospace;}.lp-wrap{max-width:var(--lp-maxw); margin:0 auto; padding:0 28px;}.lp-reveal{opacity:0; transform:translateY(16px); transition:opacity .6s ease, transform .6s ease;}.lp-reveal.in{opacity:1; transform:translateY(0);}  header.lp-nav{position:sticky; top:0; z-index:50; background:rgba(251,247,240,0.85); backdrop-filter:blur(10px); border-bottom:1px solid var(--lp-line);}.lp-nav-inner{display:flex; align-items:center; justify-content:space-between; height:68px;}.lp-brand{display:flex; align-items:center; gap:9px; font-weight:800; font-size:18px; letter-spacing:-0.01em; background:none; border:none; cursor:pointer; color:var(--lp-ink);}.lp-brand-mark{width:28px; height:28px; border-radius:8px; background:linear-gradient(135deg,var(--lp-accent),var(--lp-accent-deep)); display:flex; align-items:center; justify-content:center; color:#fff; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:14px; flex-shrink:0;}.lp-brand-sub{color:var(--lp-accent);}nav.lp-links{display:flex; align-items:center; gap:32px;}nav.lp-links a{font-size:14px; font-weight:500; color:var(--lp-muted); transition:color .15s;}nav.lp-links a:hover{color:var(--lp-ink);}.lp-nav-actions{display:flex; align-items:center; gap:14px;}.lp-btn{display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:9px; font-size:14px; font-weight:600; border:1px solid transparent; transition:transform .15s, box-shadow .15s, background .15s, border-color .15s; white-space:nowrap;}.lp-btn:active{transform:translateY(1px);}.lp-btn-primary{background:var(--lp-accent); color:#fff;}.lp-btn-primary:hover{background:var(--lp-accent-deep); box-shadow:0 6px 18px rgba(194,99,47,0.28);}.lp-btn-ghost{background:transparent; color:var(--lp-ink); border-color:var(--lp-line);}.lp-btn-ghost:hover{border-color:var(--lp-faint);}.lp-btn-sm{padding:8px 14px; font-size:13px;}.lp-nav-toggle{display:none; background:none; border:none; padding:6px; color:var(--lp-ink);}  .lp-hero{padding:88px 0 60px; position:relative; overflow:hidden;}.lp-hero::before{content:''; position:absolute; inset:-20% -10% auto -10%; height:520px; background:radial-gradient(60% 60% at 50% 30%, rgba(194,99,47,0.10), transparent 70%); pointer-events:none;}.lp-eyebrow{display:inline-flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--lp-accent-deep); background:var(--lp-accent-soft); border:1px solid var(--lp-accent-soft-line); padding:6px 12px; border-radius:100px; margin-bottom:22px;}.lp-hero-grid{display:grid; grid-template-columns:1fr; gap:16px; text-align:center; max-width:780px; margin:0 auto; position:relative;}h1.lp-headline{font-size:clamp(38px,6vw,64px); font-weight:900; letter-spacing:-0.03em; line-height:1.05; color:var(--lp-ink);}h1.lp-headline .lp-accent-word{color:var(--lp-accent);}.lp-sub{font-size:18px; color:var(--lp-muted); max-width:560px; margin:18px auto 0; line-height:1.6;}.lp-hero-ctas{display:flex; gap:12px; justify-content:center; margin-top:32px; flex-wrap:wrap;}.lp-hero-ctas .lp-btn{padding:13px 24px; font-size:15px;}  .lp-hero-preview{margin:56px auto 0; max-width:820px; background:var(--bg); border-radius:16px; padding:18px; box-shadow:0 30px 70px -20px rgba(20,23,28,0.45); border:1px solid var(--border); cursor:pointer; transition:transform .2s;}.lp-hero-preview:hover{transform:translateY(-3px);}.lp-preview-chrome{display:flex; align-items:center; gap:6px; padding:2px 6px 14px;}.lp-dot{width:9px; height:9px; border-radius:50%; background:#3A3F49;}.lp-preview-body{font-family:'JetBrains Mono',monospace; text-align:left; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px;}.lp-preview-prompt{color:var(--text); font-size:15px; margin-bottom:14px;}.lp-preview-prompt .sigil{color:var(--teal); margin-right:8px;}.lp-preview-prompt .who{color:var(--amber);}.lp-preview-row{display:flex; align-items:center; gap:9px; font-size:12.5px; color:var(--text-muted); padding:5px 0;}.lp-preview-row .chk{color:var(--teal); flex-shrink:0;}.lp-preview-row.pending .chk{color:var(--text-faint);}.lp-preview-tag{display:inline-flex; align-items:center; gap:6px; font-size:11px; color:var(--amber); background:var(--amber-dim); border:1px solid #5A481F; padding:4px 9px; border-radius:6px; margin-top:12px;}.lp-preview-hint{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--lp-faint); margin-top:12px; text-align:center;}  .lp-section{padding:96px 0;}.lp-section-head{max-width:600px; margin:0 auto 56px; text-align:center;}.lp-section-eyebrow{font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:var(--lp-accent); margin-bottom:12px;}h2.lp-section-title{font-size:clamp(28px,4vw,38px); font-weight:800; letter-spacing:-0.02em; color:var(--lp-ink);}.lp-section-desc{color:var(--lp-muted); font-size:16px; margin-top:14px; line-height:1.6;}  .lp-steps{display:grid; grid-template-columns:repeat(3,1fr); gap:0;}.lp-step{position:relative; text-align:center; padding:0 20px;}.lp-step-num{width:52px; height:52px; border-radius:50%; margin:0 auto 20px; background:var(--lp-surface); border:1.5px solid var(--lp-line); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-weight:700; font-size:15px; color:var(--lp-accent); position:relative; z-index:2;}.lp-step-connector{position:absolute; top:26px; left:calc(50% + 46px); right:calc(-50% + 46px); height:1px; background:repeating-linear-gradient(to right, var(--lp-line) 0 6px, transparent 6px 12px); z-index:1;}.lp-step:last-child .lp-step-connector{display:none;}.lp-step h3{font-size:17px; font-weight:700; margin-bottom:8px;}.lp-step p{font-size:14px; color:var(--lp-muted); line-height:1.6;}  .lp-feature-row{display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; padding:56px 0; border-bottom:1px solid var(--lp-line);}.lp-feature-row:first-child{padding-top:0;}.lp-feature-row:last-child{border-bottom:none; padding-bottom:0;}.lp-feature-row.reverse .lp-feature-copy{order:2;}.lp-feature-row.reverse .lp-feature-visual{order:1;}.lp-feature-icon{width:40px; height:40px; border-radius:10px; background:var(--lp-accent-soft); border:1px solid var(--lp-accent-soft-line); display:flex; align-items:center; justify-content:center; margin-bottom:18px; color:var(--lp-accent-deep);}.lp-feature-copy h3{font-size:23px; font-weight:800; letter-spacing:-0.01em; margin-bottom:10px;}.lp-feature-copy p{color:var(--lp-muted); font-size:15px; line-height:1.65; margin-bottom:18px;}.lp-feature-list{list-style:none; display:flex; flex-direction:column; gap:9px; padding:0;}.lp-feature-list li{display:flex; align-items:flex-start; gap:9px; font-size:14px; color:var(--lp-ink);}.lp-feature-list svg{flex-shrink:0; margin-top:2px; color:var(--lp-accent);}.lp-feature-visual{background:var(--lp-surface); border:1px solid var(--lp-line); border-radius:var(--lp-radius); padding:20px; box-shadow:0 20px 40px -24px rgba(34,29,23,0.18); min-height:220px; display:flex; flex-direction:column; justify-content:center; gap:10px;}.lp-fv-row{display:flex; align-items:center; gap:10px; padding:9px 12px; border:1px solid var(--lp-line); border-radius:8px; background:#FCFAF6;}.lp-fv-dot{width:8px; height:8px; border-radius:50%; flex-shrink:0;}.lp-fv-label{font-size:13px; font-weight:500; flex:1;}.lp-fv-meta{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--lp-faint);}.lp-fv-bars{display:flex; align-items:flex-end; gap:8px; height:110px; padding:0 6px;}.lp-fv-bar{flex:1; background:var(--lp-accent-soft); border-radius:4px 4px 0 0;}.lp-fv-bar.hi{background:var(--lp-accent);}  .lp-cta-band{background:var(--bg); border-radius:20px; padding:64px 40px; text-align:center; margin:0 auto; max-width:var(--lp-maxw);}.lp-cta-band h2{color:var(--text); font-size:clamp(26px,4vw,36px); font-weight:800; letter-spacing:-0.02em;}.lp-cta-band p{color:var(--text-muted); margin-top:14px; font-size:15.5px;}.lp-cta-band .lp-btn-primary{margin-top:28px; padding:13px 26px; font-size:15px;}  footer.lp-footer{padding:72px 0 32px; border-top:1px solid var(--lp-line); margin-top:40px;}.lp-footer-grid{display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:40px; padding-bottom:48px;}.lp-footer-brand p{color:var(--lp-muted); font-size:14px; margin-top:12px; max-width:220px; line-height:1.6;}.lp-footer-col h4{font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color:var(--lp-faint); margin-bottom:16px; font-weight:600;}.lp-footer-col ul{list-style:none; display:flex; flex-direction:column; gap:11px; padding:0;}.lp-footer-col a{font-size:14px; color:var(--lp-muted); transition:color .15s;}.lp-footer-col a:hover{color:var(--lp-ink);}.lp-footer-bottom{display:flex; justify-content:space-between; align-items:center; padding-top:24px; border-top:1px solid var(--lp-line); font-size:13px; color:var(--lp-faint); flex-wrap:wrap; gap:12px;}  @media (max-width:860px){  nav.lp-links{position:fixed; inset:68px 0 auto 0; background:var(--lp-bg); border-bottom:1px solid var(--lp-line); flex-direction:column; align-items:flex-start; padding:20px 28px; gap:18px; transform:translateY(-12px); opacity:0; pointer-events:none; transition:.2s;}  nav.lp-links.open{transform:translateY(0); opacity:1; pointer-events:auto;}  .lp-nav-toggle{display:block;}  .lp-steps{grid-template-columns:1fr; gap:36px;}  .lp-step-connector{display:none;}  .lp-feature-row,.lp-feature-row.reverse{grid-template-columns:1fr; gap:28px;}  .lp-feature-row.reverse .lp-feature-copy,.lp-feature-row.reverse .lp-feature-visual{order:initial;}  .lp-footer-grid{grid-template-columns:1fr 1fr; row-gap:32px;}}@media (max-width:520px){  .lp-footer-grid{grid-template-columns:1fr;}  .lp-cta-band{padding:48px 24px;}}  .df-root{background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; min-height:100%; padding:20px 24px 48px; box-sizing:border-box;}.df-mono{font-family:'JetBrains Mono',monospace;}.df-wrap{max-width:880px; margin:0 auto;}.df-topbar{display:flex; align-items:center; justify-content:space-between; margin-bottom:28px;}.df-back{display:flex; align-items:center; gap:7px; background:none; border:1px solid var(--border); color:var(--text-muted); font-family:'JetBrains Mono',monospace; font-size:12.5px; padding:8px 12px; border-radius:8px; cursor:pointer; transition:border-color .15s, color .15s;}.df-back:hover{border-color:var(--text-faint); color:var(--text);}.df-topbrand{display:flex; align-items:center; gap:8px; font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--text-faint);}.df-topbrand b{color:var(--amber); font-weight:600;}.df-prompt{font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:500; color:var(--text); margin:0 0 4px; letter-spacing:-0.01em;}.df-prompt .df-sigil{color:var(--teal); margin-right:10px;}.df-prompt .df-name{color:var(--amber);}.df-cursor{display:inline-block; width:9px; height:20px; background:var(--amber); margin-left:4px; vertical-align:-3px; animation:blink 1.1s step-end infinite;}@keyframes blink{50%{opacity:0;}}.df-subline{font-size:13px; color:var(--text-faint); font-family:'JetBrains Mono',monospace; margin:0 0 28px; display:flex; align-items:center; gap:14px; flex-wrap:wrap;}.df-streak{color:var(--amber);}.df-grid{display:grid; grid-template-columns:1.1fr 1fr; gap:18px;}@media (max-width:720px){.df-grid{grid-template-columns:1fr;}}.df-card{background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px;}.df-card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}.df-card-title{font-family:'JetBrains Mono',monospace; font-size:12px; text-transform:uppercase; letter-spacing:0.09em; color:var(--text-muted); display:flex; align-items:center; gap:8px; margin:0;}.df-count{font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-faint);}.df-row{display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--border);}.df-row:last-child{border-bottom:none;}.df-row-text{font-size:14px; flex:1; line-height:1.4;}.df-done .df-row-text{color:var(--text-faint); text-decoration:line-through;}.df-check-btn{background:none; border:none; padding:0; cursor:pointer; display:flex; color:var(--text-faint); flex-shrink:0;}.df-check-btn.checked{color:var(--teal);}.df-check-btn:hover{color:var(--teal);}.df-yesterday-icon{color:var(--teal); flex-shrink:0;}.df-commit-line{font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--text-faint); display:flex; align-items:center; gap:6px; margin-top:12px; padding-top:12px; border-top:1px dashed var(--border);}.df-sugg{display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border-radius:7px; background:var(--amber-dim); border:1px solid #5A481F; margin-bottom:8px;}.df-sugg-icon{color:var(--amber); flex-shrink:0; margin-top:1px;}.df-sugg-text{font-size:13px; color:var(--text); flex:1; line-height:1.4;}.df-sugg-dismiss{background:none; border:none; color:var(--text-faint); cursor:pointer; padding:2px; flex-shrink:0;}.df-sugg-dismiss:hover{color:var(--text);}.df-sugg-empty{font-size:13px; color:var(--text-faint); font-style:italic; padding:10px 2px;}.df-error{background:var(--red-dim); border:1px solid #5A2B27; border-radius:7px; padding:12px;}.df-error-top{display:flex; align-items:center; gap:8px;}.df-error-name{font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--red); font-weight:600;}.df-error-fixes{font-size:12px; color:var(--text-muted); margin:8px 0 0; display:flex; align-items:center; gap:6px;}.df-error-fixes .df-sp{color:var(--teal);}.df-timer-card{margin-top:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;}.df-timer-display{font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:600; letter-spacing:0.02em; color:var(--text);}.df-timer-display.running{color:var(--teal);}.df-timer-label{font-size:11px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.08em; font-family:'JetBrains Mono',monospace; margin-bottom:4px;}.df-timer-btns{display:flex; gap:8px;}.df-btn{border:1px solid var(--border); background:var(--surface-hover); color:var(--text); border-radius:7px; padding:9px 14px; font-size:13px; font-family:'JetBrains Mono',monospace; cursor:pointer; display:flex; align-items:center; gap:6px; transition:border-color .15s;}.df-btn:hover{border-color:var(--text-faint);}.df-btn.primary{background:var(--teal-dim); border-color:#2F5952; color:var(--teal);}.df-btn.primary:hover{border-color:var(--teal);}.df-week-bars{display:flex; align-items:flex-end; gap:5px; height:40px;}.df-week-bar{width:8px; background:var(--border); border-radius:2px; position:relative;}.df-week-bar.today{background:var(--amber);}.df-week-labels{display:flex; gap:5px; margin-top:6px;}.df-week-labels span{width:8px; font-size:9px; text-align:center; color:var(--text-faint); font-family:'JetBrains Mono',monospace;}.df-notif-row{display:flex; align-items:center; justify-content:space-between; margin-top:18px; font-size:13px; color:var(--text-muted);}.df-toast{position:fixed; bottom:24px; right:24px; background:var(--surface); border:1px solid var(--amber); border-radius:9px; padding:12px 16px; display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text); box-shadow:0 8px 24px rgba(0,0,0,0.4); animation:toastIn .25s ease-out; max-width:300px;}@keyframes toastIn{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);}}`

function pad(n) {
  return n.toString().padStart(2, '0')
}

function LandingPage({ onGetStarted, onLoginClick }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('.lp-reveal') ?? []
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="lp-root" ref={containerRef}>
      <Navbar onGetStarted={onGetStarted} onLoginClick={onLoginClick} />

      <section className="lp-hero" id="home">
        <div className="lp-wrap lp-hero-stage">
          <div className="lp-hero-copy lp-reveal in">
            <span className="lp-eyebrow">Built for people who ship</span>
            <h1 className="lp-headline">
              Keep your <span className="lp-accent-word">flow</span> in one place.
            </h1>
            <p className="lp-sub">
              DevFlow turns commits, tasks, pull requests, and focus time into a calm daily workspace for developers.
            </p>
            <div className="lp-hero-ctas">
              <button className="lp-btn lp-btn-primary" onClick={onGetStarted}>
                Start your workspace <ArrowRight size={16} />
              </button>
              <a href="#how-it-works" className="lp-btn lp-btn-ghost">How it works</a>
            </div>
          </div>

          <div className="lp-workspace lp-reveal" onClick={onGetStarted} role="button" tabIndex={0}>
            <div className="lp-workspace-nav">
              <div className="lp-workspace-brand"><span>⌘</span> DevFlow</div>
              <div className="lp-workspace-tabs"><b>Overview</b><span>Tasks</span><span>Activity</span></div>
              <div className="lp-workspace-avatar">N</div>
            </div>
            <div className="lp-workspace-content">
              <div className="lp-workspace-welcome">
                <span>Monday, 13 July</span>
                <h2>Good morning, Nisith <span>✦</span></h2>
                <p>Here&apos;s what deserves your attention today.</p>
              </div>
              <div className="lp-workspace-grid">
                <div className="lp-work-card lp-tasks-card">
                  <div className="lp-card-label">TODAY&apos;S FOCUS <span>3 tasks</span></div>
                  <div className="lp-task-row"><i>✓</i> Finish payment API <b>In progress</b></div>
                  <div className="lp-task-row"><i>○</i> Review PR #14 <b>Review</b></div>
                  <div className="lp-task-row"><i>○</i> Add auth tests <b>Next</b></div>
                </div>
                <div className="lp-work-card lp-progress-card">
                  <div className="lp-card-label">WEEKLY FLOW <span>82%</span></div>
                  <div className="lp-progress-ring"><strong>18h</strong><small>focused</small></div>
                  <div className="lp-mini-bars"><i /><i /><i /><i className="active" /><i /></div>
                </div>
                <div className="lp-work-card lp-activity-card">
                  <div className="lp-card-label">RECENT ACTIVITY</div>
                  <p><span className="lp-activity-dot green" />Auth flow merged <em>12m</em></p>
                  <p><span className="lp-activity-dot purple" />New CI run passed <em>35m</em></p>
                </div>
              </div>
            </div>
            <div className="lp-floating lp-float-left"><span>✓</span><div><b>PR merged</b><small>auth/session</small></div></div>
            <div className="lp-floating lp-float-right"><span>⚡</span><div><b>Deep work</b><small>1h 42m today</small></div></div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="how-it-works">
        <div className="lp-wrap">
          <div className="lp-section-head lp-reveal">
            <div className="lp-section-eyebrow">How it works</div>
            <h2 className="lp-section-title">Three steps, every morning</h2>
            <p className="lp-section-desc">No new workflow to learn — Devflow sits on top of the repos and tools you already use.</p>
          </div>
          <div className="lp-steps">
            <div className="lp-step lp-reveal">
              <div className="lp-step-connector" />
              <div className="lp-step-num">01</div>
              <h3>Connect your repos</h3>
              <p>Link GitHub or GitLab once. Devflow watches commits, PRs, and CI runs in the background.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-connector" />
              <div className="lp-step-num">02</div>
              <h3>Get your daily brief</h3>
              <p>Each morning, see what shipped yesterday, what&apos;s flagged, and what&apos;s next — in one screen.</p>
            </div>
            <div className="lp-step lp-reveal">
              <div className="lp-step-num">03</div>
              <h3>Work, tracked automatically</h3>
              <p>Devflow times your focus sessions and nudges you before you lose the thread.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-wrap">
          <div className="lp-section-head lp-reveal">
            <div className="lp-section-eyebrow">Everything included</div>
            <h2 className="lp-section-title">Built around one screen, not ten tabs</h2>
            <p className="lp-section-desc">Every part of Devflow feeds the same daily view — nothing you have to go dig for.</p>
          </div>

          <div className="lp-feature-row lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><GitCommit size={18} /></div>
              <h3>Daily standup, written for you</h3>
              <p>Devflow reads your commit history overnight and drafts yesterday&apos;s summary automatically — no more typing out what you did before the meeting.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Auto-generated from real commits, not guesses</li>
                <li><Check size={15} /> Editable before you share it with your team</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Fixed login API</span><span className="lp-fv-meta lp-mono">2 commits</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Completed authentication</span><span className="lp-fv-meta lp-mono">4 commits</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-line)' }} /><span className="lp-fv-label" style={{ color: 'var(--lp-faint)' }}>Payment API — in progress</span><span className="lp-fv-meta lp-mono">draft</span></div>
            </div>
          </div>

          <div className="lp-feature-row reverse lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Sparkles size={18} /></div>
              <h3>AI suggestions before code review does</h3>
              <p>Devflow scans your diffs for duplicate logic, missing tests, and stale docs — the small things that usually surface late in review.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Flags duplicate code across files</li>
                <li><Check size={15} /> Points out untested changes before you push</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Duplicate logic in auth module</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Missing tests for payment handler</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">README out of date</span></div>
            </div>
          </div>

          <div className="lp-feature-row lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Clock size={18} /></div>
              <h3>Time tracking that runs itself</h3>
              <p>Start a focus session with one click. Devflow logs the hours against the task automatically, so your week adds up without a spreadsheet.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> One click to start, pause, or reset</li>
                <li><Check size={15} /> Weekly view of hours per project</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-bars">
                <div className="lp-fv-bar" style={{ height: '38%' }} />
                <div className="lp-fv-bar" style={{ height: '64%' }} />
                <div className="lp-fv-bar" style={{ height: '44%' }} />
                <div className="lp-fv-bar" style={{ height: '80%' }} />
                <div className="lp-fv-bar hi" style={{ height: '52%' }} />
              </div>
            </div>
          </div>

          <div className="lp-feature-row reverse lp-reveal">
            <div className="lp-feature-copy">
              <div className="lp-feature-icon"><Bell size={18} /></div>
              <h3>Notifications that know when to speak up</h3>
              <p>A build failure, an idle task, a review waiting two days — Devflow only interrupts you for things that actually need a decision.</p>
              <ul className="lp-feature-list">
                <li><Check size={15} /> Quiet hours you control, per project</li>
                <li><Check size={15} /> Delivered in-app, email, or Slack</li>
              </ul>
            </div>
            <div className="lp-feature-visual">
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-accent)' }} /><span className="lp-fv-label">Mongo timeout — 3 fixes found</span><span className="lp-fv-meta lp-mono">now</span></div>
              <div className="lp-fv-row"><span className="lp-fv-dot" style={{ background: 'var(--lp-line)' }} /><span className="lp-fv-label" style={{ color: 'var(--lp-faint)' }}>PR #14 waiting 2 days</span><span className="lp-fv-meta lp-mono">idle</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="blog" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-cta-band lp-reveal">
            <h2>Start tomorrow morning with a plan.</h2>
            <p>Free for solo developers. No credit card required.</p>
            <button className="lp-btn lp-btn-primary" onClick={onGetStarted}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <footer className="lp-footer" id="about">
        <div className="lp-wrap">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-brand">
                <span className="lp-brand-mark">D</span>
                Dev<span className="lp-brand-sub">flow</span>
              </div>
              <p>The daily brief for developers who&apos;d rather ship than status-report.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Pricing</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Changelog</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Docs</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>GitHub</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Blog</a></li>
              </ul>
            </div>
            <div className="lp-footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Terms</a></li>
                <li><a href="#" onClick={(event) => event.preventDefault()}>Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Devflow. All rights reserved.</span>
            <span className="lp-mono">built by nisith</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Dashboard({ onBack, onLoginClick, user }) {
  const [today, setToday] = useState([
    { id: 1, text: 'Finish Payment API', done: false },
    { id: 2, text: 'Review PR #14', done: false },
    { id: 3, text: 'Write tests for auth module', done: false },
  ])
  const [suggestions, setSuggestions] = useState([
    { id: 1, text: 'Your auth module has duplicate code across login.js and signup.js' },
    { id: 2, text: 'You forgot to write tests for the payment handler' },
    { id: 3, text: 'README needs an update — install steps are out of date' },
  ])
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!running) return undefined
    const intervalId = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [running])

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const toggleToday = (id) => {
    setToday((list) => list.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const dismissSuggestion = (id) => {
    setSuggestions((list) => list.filter((item) => item.id !== id))
  }

  const sendTestNotification = () => {
    setToast({ title: 'Devflow', body: "Reminder: you've been coding for 45 min. Take a short break." })
  }

  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  const timeStr = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`

  const week = [
    { d: 'M', h: 5 },
    { d: 'T', h: 7 },
    { d: 'W', h: 4 },
    { d: 'T', h: 6 },
    { d: 'F', h: 3, today: true },
  ]
  const maxH = Math.max(...week.map((item) => item.h), 1)
  const completedYesterday = ['Fixed Login API', 'Completed Authentication', '4 commits pushed to main']

  return (
    <div>
      <Navbar onGetStarted={onBack} onLoginClick={onLoginClick} />
      <div className="df-root">
        <div className="df-wrap">
          <div className="df-topbar">
            <button className="df-back" onClick={onBack}>
              <ArrowLeft size={13} /> Back to homepage
            </button>
            <div className="df-topbrand">
              <Zap size={13} color="var(--amber)" />
              <b>Devflow</b>
            </div>
          </div>

        <p className="df-prompt">
          <span className="df-sigil">$</span> good morning, <span className="df-name">{user?.name || 'developer'}</span>
          <span className="df-cursor" />
        </p>
        <p className="df-subline">
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          <span>·</span>
          <span className="df-streak df-mono">🔥 6-day streak</span>
          <span>·</span>
          <span>3 repos active</span>
        </p>

        <div className="df-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title">Yesterday</p>
                <span className="df-count">3 items</span>
              </div>
              {completedYesterday.map((item, index) => (
                <div className="df-row" key={index}>
                  <Check size={15} className="df-yesterday-icon" />
                  <span className="df-row-text" style={{ color: 'var(--text-muted)' }}>{item}</span>
                </div>
              ))}
              <div className="df-commit-line">
                <GitCommit size={13} />
                <span>4 commits · devflow-api</span>
              </div>
            </div>

            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title">Today</p>
                <span className="df-count">{today.filter((task) => task.done).length}/{today.length} done</span>
              </div>
              {today.map((task) => (
                <div className={`df-row ${task.done ? 'df-done' : ''}`} key={task.id}>
                  <button
                    className={`df-check-btn ${task.done ? 'checked' : ''}`}
                    onClick={() => toggleToday(task.id)}
                    aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.done ? <Check size={16} /> : <Circle size={16} />}
                  </button>
                  <span className="df-row-text">{task.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title"><Sparkles size={13} /> AI Suggestions</p>
                <span className="df-count">{suggestions.length}</span>
              </div>
              {suggestions.length === 0 ? (
                <p className="df-sugg-empty">All clear — nothing flagged right now.</p>
              ) : (
                suggestions.map((item) => (
                  <div className="df-sugg" key={item.id}>
                    <AlertTriangle size={14} className="df-sugg-icon" />
                    <span className="df-sugg-text">{item.text}</span>
                    <button className="df-sugg-dismiss" onClick={() => dismissSuggestion(item.id)} aria-label="Dismiss suggestion">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="df-card">
              <div className="df-card-head">
                <p className="df-card-title"><Bug size={13} /> Recent Errors</p>
              </div>
              <div className="df-error">
                <div className="df-error-top">
                  <span className="df-error-name df-mono">Mongo Timeout</span>
                </div>
                <p className="df-error-fixes">
                  <ChevronRight size={13} className="df-sp" /> AI found 3 possible fixes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="df-card df-timer-card">
          <div>
            <div className="df-timer-label">Focus timer</div>
            <div className={`df-timer-display ${running ? 'running' : ''}`}>{timeStr}</div>
          </div>
          <div>
            <div className="df-timer-label">This week</div>
            <div className="df-week-bars">
              {week.map((item, index) => (
                <div key={index} className={`df-week-bar ${item.today ? 'today' : ''}`} style={{ height: `${(item.h / maxH) * 40}px` }} title={`${item.h}h`} />
              ))}
            </div>
            <div className="df-week-labels">{week.map((item, index) => <span key={index}>{item.d}</span>)}</div>
          </div>
          <div className="df-timer-btns">
            <button className="df-btn primary" onClick={() => setRunning((value) => !value)}>
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? 'Pause' : 'Start'}
            </button>
            <button className="df-btn" onClick={() => { setRunning(false); setSeconds(0) }}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        <div className="df-notif-row">
          <span className="df-mono"><Bell size={13} style={{ verticalAlign: -2, marginRight: 6 }} /> Notifications on</span>
          <button className="df-btn" onClick={sendTestNotification}>Send test notification</button>
        </div>
        </div>
      </div>

      {toast && (
        <div className="df-toast">
          <Bell size={16} color="var(--amber)" />
          <div>
            <div className="df-mono" style={{ fontSize: 12, color: 'var(--amber)', marginBottom: 2 }}>{toast.title}</div>
            <div>{toast.body}</div>
          </div>
        </div>
      )}
    </div>
  )
}


export default function DevflowApp() {
  const [view, setView] = useState('landing')
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('auth') !== 'success') return

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to complete Google sign-in.')
        return response.json()
      })
      .then(({ user: signedInUser }) => {
        setUser(signedInUser)
        setView('dashboard')
      })
      .catch(() => setAuthOpen(true))
      .finally(() => window.history.replaceState({}, '', window.location.pathname))
  }, [])

  const goToDashboard = () => {
    setView('dashboard')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const goToLanding = () => {
    setView('landing')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleAuthenticated = (signedInUser) => {
    setUser(signedInUser)
    setAuthOpen(false)
    goToDashboard()
  }

  return (
    <div className="app-shell">
      <style>{FONT_IMPORT + APP_STYLES}</style>
      <div className="app-view" key={view}>
        {view === 'landing'
          ? <LandingPage onGetStarted={goToDashboard} onLoginClick={() => setAuthOpen(true)} />
          : <Dashboard onBack={goToLanding} onLoginClick={() => setAuthOpen(true)} user={user} />}
      </div>
      {authOpen && <LoginModal onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} />}
    </div>
  )
}
