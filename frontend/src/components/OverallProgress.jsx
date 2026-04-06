import ProgressBar from './ProgressBar.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function OverallProgress({ topics }) {
  const { t } = useTheme();
  const total = topics.reduce((sum, t) => sum + t.totalCount, 0);
  const completed = topics.reduce((sum, t) => sum + t.completedCount, 0);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
      <div className="flex-shrink-0 flex items-center gap-3">
        <div>
          <h2 className="text-sm md:text-base font-bold leading-tight" style={{ color: t.textHeading }}>
            Overall Progress
          </h2>
          <p className="text-xs mt-0.5" style={{ color: t.textMuted }}>
            {topics.length} topics · {total} problems
          </p>
        </div>
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            color: '#a78bfa',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#a78bfa', animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          {pct}% done
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <ProgressBar completed={completed} total={total} />
      </div>
    </div>
  );
}
