import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import AddTopicModal from './AddTopicModal.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const BTS_MEMBERS = [
  { name: 'RM',      color: '#a78bfa', emoji: '👑', floatClass: 'float-1', role: 'Leader' },
  { name: 'Jin',     color: '#f9a8d4', emoji: '🌸', floatClass: 'float-2', role: 'Vocalist' },
  { name: 'Suga',    color: '#818cf8', emoji: '🎹', floatClass: 'float-3', role: 'Rapper' },
  { name: 'J-Hope',  color: '#fbbf24', emoji: '☀️', floatClass: 'float-4', role: 'Dancer' },
  { name: 'Jimin',   color: '#f472b6', emoji: '🌙', floatClass: 'float-5', role: 'Vocalist' },
  { name: 'V',       color: '#c4b5fd', emoji: '🎨', floatClass: 'float-6', role: 'Vocalist' },
  { name: 'Jungkook',color: '#34d399', emoji: '🐰', floatClass: 'float-7', role: 'Maknae' },
];

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

  const totalSolved = topics.reduce((s, tp) => s + tp.completedCount, 0);
  const totalQuestions = topics.reduce((s, tp) => s + tp.totalCount, 0);

  return (
    <>
      <aside
        className="w-64 flex flex-col h-full flex-shrink-0 transition-all duration-300"
        style={{ background: t.bgSidebar, borderRight: `1px solid ${t.borderSidebar}` }}
      >
        {/* ── BTS HEADER ── */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          {/* Logo row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-black flex-shrink-0 army-bomb-glow"
              style={{ background: 'linear-gradient(135deg, #9333ea, #ec4899, #fbbf24)' }}
            >
              ✦
            </div>
            <div>
              <h1 className="bts-title text-base leading-none">AeiRo DSA Space</h1>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(240,171,252,0.5)' }}>
                Track your grind 💜
              </p>
            </div>
          </div>

          {/* Stats pill */}
          <div
            className="rounded-xl px-3 py-2 flex items-center justify-between mb-3"
            style={{ background: t.bgStatPill, border: `1px solid ${t.borderStatPill}` }}
          >
            <span className="text-xs" style={{ color: 'rgba(240,171,252,0.5)' }}>{topics.length} topics</span>
            <span className="text-xs font-bold" style={{ color: '#f472b6' }}>
              {totalSolved}/{totalQuestions} solved
            </span>
          </div>

          {/* BTS Member Cards — 7 animated mini cards */}
          <div className="grid grid-cols-7 gap-1">
            {BTS_MEMBERS.map((m) => (
              <div
                key={m.name}
                className={`${m.floatClass} flex flex-col items-center gap-0.5 cursor-default`}
                title={`${m.name} — ${m.role}`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${m.color}22, ${m.color}44)`,
                    border: `1px solid ${m.color}55`,
                    boxShadow: `0 0 8px ${m.color}33`,
                  }}
                >
                  {m.emoji}
                </div>
                <span className="text-[7px] font-bold truncate w-full text-center leading-none"
                  style={{ color: m.color, opacity: 0.85 }}>
                  {m.name.split('-')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOPIC LIST ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2"
            style={{ color: 'rgba(240,171,252,0.3)' }}>
            💜 Topics
          </p>
          {topics.map((topic) => {
            const isSelected = topic._id === selectedTopicId;
            const pct = topic.totalCount > 0
              ? Math.round((topic.completedCount / topic.totalCount) * 100) : 0;

            return (
              <div
                key={topic._id}
                onClick={() => onSelectTopic(topic._id)}
                className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 cursor-pointer transition-all duration-200"
                style={{
                  touchAction: 'manipulation',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(147,51,234,0.3), rgba(236,72,153,0.15))'
                    : 'transparent',
                  border: isSelected
                    ? '1px solid rgba(236,72,153,0.4)'
                    : '1px solid transparent',
                  boxShadow: isSelected ? '0 0 20px rgba(236,72,153,0.15)' : 'none',
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = t.bgTopicHover; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                {isSelected && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #9333ea, #ec4899)' }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="text-sm font-medium truncate"
                      style={{ color: isSelected ? '#fdf4ff' : t.textTopicInactive }}>
                      {topic.name}
                    </span>
                    <span className="text-[10px] font-semibold flex-shrink-0 tabular-nums"
                      style={{ color: isSelected ? '#f472b6' : 'rgba(240,171,252,0.3)' }}>
                      {topic.completedCount}/{topic.totalCount}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: t.progressTrackSide }}>
                    <div
                      className="h-1 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: pct === 100
                          ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                          : 'linear-gradient(90deg, #9333ea, #ec4899)',
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(e, topic._id)}
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

        {/* ── ADD TOPIC ── */}
        <div className="p-3" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <button
            onClick={() => setShowAddTopic(true)}
            className="w-full py-2.5 px-3 text-sm font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #ec4899)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(236,72,153,0.35)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(236,72,153,0.6)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(236,72,153,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
