export default function StatCard({ title, value, note, icon: Icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={21} /></div>
      <div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{note}</small></div>
    </article>
  );
}
