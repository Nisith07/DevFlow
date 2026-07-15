/**
 * @param {{
 *   icon?: React.ReactNode,
 *   title: string,
 *   description?: string,
 *   action?: React.ReactNode
 * }} props
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  )
}
