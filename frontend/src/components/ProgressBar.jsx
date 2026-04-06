import { useTheme } from '../contexts/ThemeContext.jsx';

export default function ProgressBar({ completed, total, className = '' }) {
  const { t } = useTheme();
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs" style={{ color: t.textMuted }}>{completed} / {total} solved</span>
        <span className="text-xs font-bold tabular-nums" style={{ color: '#a78bfa' }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.progressTrack }}>
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100
              ? 'linear-gradient(90deg, #22c55e, #16a34a)'
              : 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)',
            boxShadow: pct > 0 ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
