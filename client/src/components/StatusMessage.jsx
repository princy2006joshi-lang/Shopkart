export default function StatusMessage({ message, type = 'error' }) {
  if (!message) return null
  return <div className={`status-message ${type}`} role={type === 'error' ? 'alert' : 'status'}>{message}</div>
}
