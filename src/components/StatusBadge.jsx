export default function StatusBadge({ status }) {
  const className = String(status || "").toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${className}`}>{status}</span>;
}
