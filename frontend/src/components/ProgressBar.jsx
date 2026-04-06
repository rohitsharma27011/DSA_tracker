export default function ProgressBar({ completed, total, className = '' }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const color =
    pct === 100
      ? 'bg-green-500'
      : pct > 50
      ? 'bg-blue-500'
      : 'bg-blue-400';

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{completed} / {total} solved</span>
        <span className="text-xs font-semibold text-gray-600">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
