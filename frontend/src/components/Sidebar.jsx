import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import AddTopicModal from './AddTopicModal.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function Sidebar({ topics, selectedTopicId, onSelectTopic }) {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const deleteTopic = useMutation({
    mutationFn: (id) => client.delete(`/topics/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      queryClient.removeQueries({ queryKey: ['questions', id] });
    },
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Delete this topic and all its questions?')) {
      deleteTopic.mutate(id);
    }
  };

  const totalSolved = topics.reduce((s, t) => s + t.completedCount, 0);
  const totalQuestions = topics.reduce((s, t) => s + t.totalCount, 0);

  return (
    <>
      <aside
        className="w-64 flex flex-col h-full flex-shrink-0 transition-all duration-300"
        style={{ background: t.bgSidebar, borderRight: `1px solid ${t.borderSidebar}` }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
            >
              A
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">AeiRo DSA Space</h1>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Track your grind ✦</p>
            </div>
          </div>
          {/* Stats pill */}
          <div
            className="rounded-lg px-3 py-2 flex items-center justify-between"
            style={{ background: t.bgStatPill, border: `1px solid ${t.borderStatPill}` }}
          >
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{topics.length} topics</span>
            <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>
              {totalSolved}/{totalQuestions} solved
            </span>
          </div>
        </div>

        {/* Topic list */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Topics
          </p>
          {topics.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            const pct = topic.totalCount > 0
              ? Math.round((topic.completedCount / topic.totalCount) * 100)
              : 0;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all duration-200"
                style={{
                  touchAction: 'manipulation',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(168,85,247,0.2))'
                    : 'transparent',
                  border: isSelected
                    ? '1px solid rgba(124,58,237,0.5)'
                    : '1px solid transparent',
                  boxShadow: isSelected ? '0 0 16px rgba(124,58,237,0.2)' : 'none',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = t.bgTopicHover; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Active indicator */}
                {isSelected && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #7c3aed, #ec4899)' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: isSelected ? '#fff' : t.textTopicInactive }}
                    >
                      {topic.name}
                    </span>
                    <span
                      className="text-[10px] font-semibold flex-shrink-0 tabular-nums"
                      style={{ color: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}
                    >
                      {topic.completedCount}/{topic.totalCount}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: t.progressTrackSide }}>
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100
                          ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                          : 'linear-gradient(90deg, #7c3aed, #a855f7)',
                      }}
                    />
                  </div>
                </div>
                {/* Delete */}
                <button
                  onClick={(e) => handleDelete(e, topic.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(239,68,68,0.15)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
                  title="Delete topic"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </nav>

        {/* Add topic */}
        <div className="p-3" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <button
            onClick={() => setShowAddTopic(true)}
            className="w-full py-2.5 px-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(124,58,237,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span className="text-base leading-none">+</span>
            New Topic
          </button>
        </div>
      </aside>

      {showAddTopic && <AddTopicModal onClose={() => setShowAddTopic(false)} />}
    </>
  );
}
