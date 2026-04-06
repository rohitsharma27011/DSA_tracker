import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import EditQuestionModal from './EditQuestionModal.jsx';

const DIFFICULTY_STYLES = {
  Easy: 'bg-green-100 text-green-700 border border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border border-red-200',
};

export default function QuestionRow({ question, isLast }) {
  const [showEdit, setShowEdit] = useState(false);
  const queryClient = useQueryClient();

  const toggleComplete = useMutation({
    mutationFn: (completed) =>
      client.put(`/questions/${question.id}`, { completed }),
    onMutate: async (completed) => {
      await queryClient.cancelQueries({ queryKey: ['questions', question.topicId] });
      const prev = queryClient.getQueryData(['questions', question.topicId]);
      queryClient.setQueryData(['questions', question.topicId], (old) =>
        old.map((q) => (q.id === question.id ? { ...q, completed } : q))
      );
      queryClient.setQueryData(['topics'], (old) =>
        old?.map((t) =>
          t.id === question.topicId
            ? { ...t, completedCount: t.completedCount + (completed ? 1 : -1) }
            : t
        )
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      queryClient.setQueryData(['questions', question.topicId], ctx.prev);
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });

  const deleteQuestion = useMutation({
    mutationFn: () => client.delete(`/questions/${question.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', question.topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });

  const handleDelete = () => {
    if (window.confirm('Delete this question?')) {
      deleteQuestion.mutate();
    }
  };

  const titleEl = question.url ? (
    <a
      href={question.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-sm font-medium hover:text-blue-600 hover:underline transition-colors ${
        question.completed ? 'line-through text-gray-400' : 'text-gray-800'
      }`}
    >
      {question.title}
    </a>
  ) : (
    <span
      className={`text-sm font-medium ${
        question.completed ? 'line-through text-gray-400' : 'text-gray-800'
      }`}
    >
      {question.title}
    </span>
  );

  const diffBadge = (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
        DIFFICULTY_STYLES[question.difficulty] || ''
      }`}
    >
      {question.difficulty}
    </span>
  );

  const actions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowEdit(true)}
        className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
        title="Edit"
      >
        ✏️
      </button>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 transition-colors text-sm"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop row (sm+): fixed grid */}
      <div
        className={`hidden sm:grid sm:grid-cols-[2.5rem_1fr_7rem_5rem] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${
          !isLast ? 'border-b border-gray-100' : ''
        } ${question.completed ? 'opacity-60' : ''}`}
      >
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={question.completed}
            onChange={(e) => toggleComplete.mutate(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
          />
        </div>
        <div>{titleEl}</div>
        <div>{diffBadge}</div>
        <div className="flex items-center justify-center">{actions}</div>
      </div>

      {/* Mobile row: stacked card layout */}
      <div
        className={`sm:hidden flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
          !isLast ? 'border-b border-gray-100' : ''
        } ${question.completed ? 'opacity-60' : ''}`}
      >
        <input
          type="checkbox"
          checked={question.completed}
          onChange={(e) => toggleComplete.mutate(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-blue-600 cursor-pointer flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="mb-1">{titleEl}</div>
          <div className="flex items-center gap-2">
            {diffBadge}
            {actions}
          </div>
        </div>
      </div>

      {showEdit && (
        <EditQuestionModal question={question} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}
