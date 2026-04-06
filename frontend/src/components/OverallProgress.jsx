import ProgressBar from './ProgressBar.jsx';

export default function OverallProgress({ topics }) {
  const total = topics.reduce((sum, t) => sum + t.totalCount, 0);
  const completed = topics.reduce((sum, t) => sum + t.completedCount, 0);

  return (
    <div className="flex items-center gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Overall Progress</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {topics.length} topics · {total} problems
        </p>
      </div>
      <div className="flex-1 max-w-sm">
        <ProgressBar completed={completed} total={total} />
      </div>
    </div>
  );
}
