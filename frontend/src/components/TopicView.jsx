import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import client from '../api/client.js';
import QuestionRow from './QuestionRow.jsx';
import ProgressBar from './ProgressBar.jsx';
import AddQuestionModal from './AddQuestionModal.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const DIFF_ACTIVE = {
  All:    { background: 'linear-gradient(135deg, #4b5563, #374151)', color: '#e2e8f0', border: 'transparent' },
  Easy:   { background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(22,163,74,0.15))', color: '#4ade80', border: 'rgba(34,197,94,0.4)' },
  Medium: { background: 'linear-gradient(135deg, rgba(234,179,8,0.25), rgba(202,138,4,0.15))', color: '#facc15', border: 'rgba(234,179,8,0.4)' },
  Hard:   { background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(185,28,28,0.15))', color: '#f87171', border: 'rgba(239,68,68,0.4)' },
};

export default function TopicView({ topicId, topics }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const topic = topics.find((tp) => tp._id === topicId);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions', topicId],
    queryFn: () => client.get(`/topics/${topicId}/questions`).then((r) => r.data),
    enabled: !!topicId,
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedIds) => {
      console.log('[reorder] sending to server:', orderedIds);
      return client.put(`/topics/${topicId}/questions/reorder`, { orderedIds }).then((r) => r.data);
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: ['questions', topicId] });
      const prev = queryClient.getQueryData(['questions', topicId]);
      console.log('[reorder] prev order:', prev?.map(q => q.title));
      const map = new Map((prev || []).map((q) => [q._id, q]));
      const next = orderedIds.map((id) => map.get(id)).filter(Boolean);
      console.log('[reorder] optimistic order:', next.map(q => q.title));
      queryClient.setQueryData(['questions', topicId], next);
      return { prev };
    },
    onSuccess: (data) => {
      console.log('[reorder] server confirmed:', data?.map(q => q.title));
      queryClient.setQueryData(['questions', topicId], data);
    },
    onError: (err, __, ctx) => {
      console.error('[reorder] error:', err);
      queryClient.setQueryData(['questions', topicId], ctx.prev);
    },
  });

  function handleDragEnd({ active, over }) {
    console.log('[drag] active:', active?.id, 'over:', over?.id);
    if (!over || active.id === over.id) return;
    const oldIndex = questions.findIndex((q) => q._id === active.id);
    const newIndex = questions.findIndex((q) => q._id === over.id);
    console.log('[drag] oldIndex:', oldIndex, 'newIndex:', newIndex);
    const reordered = arrayMove(questions, oldIndex, newIndex);
    console.log('[drag] reordered titles:', reordered.map(q => q.title));
    reorderMutation.mutate(reordered.map((q) => q._id));
  }

  const filtered = questions.filter((q) => {
    const matchesDiff = filter === 'All' || q.difficulty === filter;
    const matchesSearch =
      search.trim() === '' ||
      q.title.toLowerCase().includes(search.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const completed = questions.filter((q) => q.completed).length;

  if (!topic) return null;

  return (
    <div className="p-4 md:p-6 fade-in-up">
      {/* Topic header */}
      <div className="mb-6">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight gradient-text">
              {topic.name}
            </h2>
            <p className="text-xs mt-1" style={{ color: t.textMuted }}>
              {completed} of {questions.length} completed
            </p>
          </div>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span className="text-base leading-none">+</span>
            Add Question
          </button>
        </div>
        <ProgressBar completed={completed} total={questions.length} />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((d) => {
            const active = filter === d;
            const s = active ? DIFF_ACTIVE[d] : null;
            return (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200"
                style={{
                  background: active ? s.background : t.bgInactiveFilter,
                  color: active ? s.color : t.textSecondary,
                  border: `1px solid ${active ? s.border : t.border}`,
                  boxShadow: active && d !== 'All' ? `0 0 10px ${s.border}` : 'none',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="w-full sm:w-auto sm:ml-auto relative">
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-sm rounded-xl focus:outline-none transition-all"
            style={{
              background: t.bgInput,
              border: `1px solid ${t.borderInput}`,
              color: t.textPrimary,
            }}
            onFocus={(e) => { e.target.style.border = '1px solid rgba(124,58,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
            onBlur={(e) => { e.target.style.border = `1px solid ${t.borderInput}`; e.target.style.boxShadow = 'none'; }}
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: t.textMuted }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Questions list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-2" style={{ color: t.textMuted }}>
          <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: t.loadingColor, borderTopColor: 'transparent' }} />
          <span className="text-sm">Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl" style={{ opacity: 0.2 }}>◎</div>
          <p className="text-sm" style={{ color: t.emptyText }}>
            {questions.length === 0 ? 'No questions yet — add your first one!' : 'No questions match your filter.'}
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={questions.map((q) => q._id)} strategy={verticalListSortingStrategy}>
            <div
              className="rounded-2xl transition-all duration-300"
              style={{ background: t.bgCard, border: `1px solid ${t.border}`, overflow: 'visible' }}
            >
              {/* Header — desktop only */}
              <div
                className="hidden sm:grid sm:grid-cols-[1.5rem_2.5rem_2.5rem_1fr_7rem_5rem] gap-3 px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ borderBottom: `1px solid ${t.border}`, color: t.tableHeaderText, background: t.bgCardHeader }}
              >
                <div />
                <div>#</div>
                <div />
                <div>Title</div>
                <div>Difficulty</div>
                <div className="text-center">Actions</div>
              </div>
              {filtered.map((question, idx) => (
                <QuestionRow
                  key={question._id}
                  question={question}
                  topicId={topicId}
                  isLast={idx === filtered.length - 1}
                  number={questions.findIndex((q) => q._id === question._id) + 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {showAddQuestion && (
        <AddQuestionModal topicId={topicId} onClose={() => setShowAddQuestion(false)} />
      )}
    </div>
  );
}
