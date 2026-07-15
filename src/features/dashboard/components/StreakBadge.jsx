export default function StreakBadge({ streak = 6 }) {
  return (
    <span className="df-streak df-mono">
      🔥 {streak}-day streak
    </span>
  )
}
