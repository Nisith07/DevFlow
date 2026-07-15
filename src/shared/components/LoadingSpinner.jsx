/**
 * @param {{ fullScreen?: boolean, size?: number }} props
 */
export default function LoadingSpinner({ fullScreen = false, size = 32 }) {
  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--color-app-bg)',
        }}
      >
        <div
          className="spinner-ring"
          style={{ width: size, height: size }}
          aria-label="Loading"
          role="status"
        />
      </div>
    )
  }

  return (
    <div className="loading-spinner" aria-label="Loading" role="status">
      <div className="spinner-ring" style={{ width: size, height: size }} />
    </div>
  )
}
