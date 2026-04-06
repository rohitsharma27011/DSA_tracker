import ProgressBar from './ProgressBar.jsx';

export default function OverallProgress({ topics }) {
  const total = topics.reduce((sum, t) => sum + t.totalCount, 0);
  const completed = topics.reduce((sum, t) => sum + t.completedCount, 0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
      <div className="flex-shrink-0">
        <h2 className="text-base md:text-xl font-bold text-gray-800 leading-tight">Overall Progress</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {topics.length} topics · {total} problems
        </p>
      </div>
      <div className="flex-1 min-w-0">
        <ProgressBar completed={completed} total={total} />
      </div>
    </div>
  );
}
