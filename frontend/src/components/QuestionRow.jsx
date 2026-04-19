import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import client from '../api/client.js';
import EditQuestionModal from './EditQuestionModal.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const DIFF_BADGE = {
  Easy:   { background: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)',  glow: '0 0 8px rgba(34,197,94,0.2)' },
  Medium: { background: 'rgba(234,179,8,0.12)',  color: '#facc15', border: '1px solid rgba(234,179,8,0.25)',  glow: '0 0 8px rgba(234,179,8,0.2)' },
  Hard:   { background: 'rgba(239,68,68,0.12)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)',  glow: '0 0 8px rgba(239,68,68,0.2)' },
};

export default function QuestionRow({ question, topicId, isLast, number }) {
  const [showEdit, setShowEdit] = useState(false);
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question._id,
  });

  const toggleComplete = useMutation({
    mutationFn: (completed) => client.put(`/questions/${question._id}`, { completed }),
    onMutate: async (completed) => {
      await queryClient.cancelQueries({ queryKey: ['questions', topicId] });
      await queryClient.cancelQueries({ queryKey: ['topics'] });
      const prevQuestions = queryClient.getQueryData(['questions', topicId]);
      const prevTopics = queryClient.getQueryData(['topics']);
      queryClient.setQueryData(['questions', topicId], (old) =>
        old.map((q) => (q._id === question._id ? { ...q, completed } : q))
      );
      queryClient.setQueryData(['topics'], (old) =>
        old?.map((tp) =>
          tp._id === topicId
            ? { ...tp, completedCount: tp.completedCount + (completed ? 1 : -1) }
            : tp
        )
      );
      return { prevQuestions, prevTopics };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prevQuestions) queryClient.setQueryData(['questions', topicId], ctx.prevQuestions);
      if (ctx?.prevTopics) queryClient.setQueryData(['topics'], ctx.prevTopics);
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: () => client.delete(`/questions/${question._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });

  const handleDelete = () => {
    if (window.confirm('Delete this question?')) deleteQuestion.mutate();
  };

  const badge = DIFF_BADGE[question.difficulty];
  const completedColor = t.isDark ? '#4b5563' : '#c4b5fd';

  const titleEl = question.url ? (
    <a
      href={question.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium transition-colors"
      style={{ color: question.completed ? completedColor : t.textPrimary, textDecoration: question.completed ? 'line-through' : 'none' }}
      onMouseEnter={(e) => { if (!question.completed) e.target.style.color = '#a78bfa'; }}
      onMouseLeave={(e) => { if (!question.completed) e.target.style.color = t.textPrimary; }}
    >
      {question.title}
    </a>
  ) : (
    <span
      className="text-sm font-medium"
      style={{ color: question.completed ? completedColor : t.textPrimary, textDecoration: question.completed ? 'line-through' : 'none' }}
    >
      {question.title}
    </span>
  );

  const diffBadge = badge ? (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
      style={{ background: badge.background, color: badge.color, border: badge.border, boxShadow: badge.glow }}
    >
      {question.difficulty}
    </span>
  ) : null;

  const actionBtns = (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => setShowEdit(true)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.25)'; e.currentTarget.style.color = '#a78bfa'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; e.currentTarget.style.color = '#7c3aed'; }}
        title="Edit"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={handleDelete}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
        title="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  const dragHandle = (
    <div
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-5 flex-shrink-0"
      style={{ cursor: isDragging ? 'grabbing' : 'grab', color: t.textMuted, opacity: 0.5, touchAction: 'none' }}
      title="Drag to reorder"
    >
      <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
        <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
        <circle cx="3" cy="8" r="1.5"/><circle cx="9" cy="8" r="1.5"/>
        <circle cx="3" cy="13" r="1.5"/><circle cx="9" cy="13" r="1.5"/>
      </svg>
    </div>
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          borderBottom: !isLast ? `1px solid ${t.rowBorder}` : 'none',
          opacity: isDragging ? 0.4 : question.completed ? 0.55 : 1,
          background: isDragging ? t.bgHover : 'transparent',
          zIndex: isDragging ? 999 : 'auto',
          position: 'relative',
        }}
        onMouseEnter={(e) => { if (!isDragging) e.currentTarget.style.background = t.bgHover; }}
        onMouseLeave={(e) => { if (!isDragging) e.currentTarget.style.background = isDragging ? t.bgHover : 'transparent'; }}
      >
        {/* Desktop */}
        <div className="hidden sm:grid sm:grid-cols-[1.5rem_2.5rem_2.5rem_1fr_7rem_5rem] gap-3 px-5 py-3.5 items-center">
          {dragHandle}
          <div className="flex justify-center">
            <span className="text-xs font-bold tabular-nums" style={{ color: t.textMuted }}>
              {number}
            </span>
          </div>
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={question.completed}
              onChange={(e) => toggleComplete.mutate(e.target.checked)}
              className="custom-checkbox"
            />
          </div>
          <div className="min-w-0 truncate">{titleEl}</div>
          <div>{diffBadge}</div>
          <div className="flex justify-center">{actionBtns}</div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-start gap-2 px-4 py-3.5">
          <div className="mt-1">{dragHandle}</div>
          <span className="text-xs font-bold tabular-nums mt-1 flex-shrink-0" style={{ color: t.textMuted, minWidth: '16px' }}>
            {number}
          </span>
          <input
            type="checkbox"
            checked={question.completed}
            onChange={(e) => toggleComplete.mutate(e.target.checked)}
            className="custom-checkbox mt-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 truncate">{titleEl}</div>
            <div className="flex items-center gap-2">{diffBadge}{actionBtns}</div>
          </div>
        </div>
      </div>

      {showEdit && <EditQuestionModal question={question} topicId={topicId} onClose={() => setShowEdit(false)} />}
    </>
  );
}
