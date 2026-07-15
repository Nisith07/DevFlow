export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create your workspace',
      desc: 'Sign up in seconds. No setup wizard, no onboarding call — just your first project and a clean task list.',
    },
    {
      num: '02',
      title: 'Plan your day',
      desc: 'Each morning, open the Daily Planner. Drag tasks into time blocks and set your top priorities for the session.',
    },
    {
      num: '03',
      title: 'Ship and track progress',
      desc: 'DevFlow logs your completions, tracks your streak, and surfaces what needs attention — so you stay in flow.',
    },
  ]

  return (
    <section className="lp-section" id="how-it-works">
      <div className="lp-wrap">
        <div className="lp-section-head reveal">
          <div className="lp-section-eyebrow">How it works</div>
          <h2 className="lp-section-title">Three steps, every morning</h2>
          <p className="lp-section-desc">
            No new workflow to learn — DevFlow is built around the way developers
            actually work, not enterprise ticket processes.
          </p>
        </div>

        <div className="lp-steps">
          {steps.map((step, i) => (
            <div key={step.num} className="lp-step reveal">
              {i < steps.length - 1 && <div className="lp-step-connector" />}
              <div className="lp-step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
