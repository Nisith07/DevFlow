export default function DevFlowLogo({ size = 32, iconSize = 18, className = '' }) {
  const borderRadius = Math.round(size * 0.28)
  
  return (
    <div
      className={`devflow-logo-badge ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: 'linear-gradient(135deg, #FF7A1A 0%, #E65C00 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(255, 122, 26, 0.45)',
        flexShrink: 0,
      }}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left workflow code bracket */}
        <path
          d="M8 6C5.79086 6 4 7.79086 4 10V10.5C4 11.3284 3.32843 12 2.5 12C3.32843 12 4 12.6716 4 13.5V14C4 16.2091 5.79086 18 8 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right workflow code bracket */}
        <path
          d="M16 6C18.2091 6 20 7.79086 20 10V10.5C20 11.3284 20.6716 12 21.5 12C20.6716 12 20 12.6716 20 13.5V14C20 16.2091 18.2091 18 16 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central connecting flow dot */}
        <circle cx="12" cy="12" r="1.75" fill="white" />
      </svg>
    </div>
  )
}
