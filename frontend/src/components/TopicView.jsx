import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client.js';
import QuestionRow from './QuestionRow.jsx';
import ProgressBar from './ProgressBar.jsx';
import AddQuestionModal from './AddQuestionModal.jsx';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function TopicView({ topicId, topics }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const topic = topics.find((t) => t.id === topicId);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions', topicId],
    queryFn: () => client.get(`/topics/${topicId}/questions`).then((r) => r.data),
    enabled: !!topicId,
  });

  const filtered = questions.filter((q) => {
    const matchesDiff = filter === 'All' || q.difficulty === filter;
    const matchesSearch =
      search.trim() === '' ||
      q.title.toLowerCase().includes(search.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  const completed = questions.filter((q) => q.completed).length;

  if (!topic) return null;

  const diffColors = {
    All: 'bg-gray-100 text-gray-700 border-gray-200',
    Easy: 'bg-green-50 text-green-700 border-green-200',
    Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="p-6">
      {/* Topic header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-800">{topic.name}</h2>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            + Add Question
          </button>
        </div>
        <ProgressBar completed={completed} total={questions.length} className="max-w-sm" />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                filter === d
                  ? d === 'All'
                    ? 'bg-gray-800 text-white border-gray-800'
                    : d === 'Easy'
                    ? 'bg-green-500 text-white border-green-500'
                    : d === 'Medium'
                    ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-red-500 text-white border-red-500'
                  : diffColors[d]
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
        />
      </div>

      {/* Questions table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {questions.length === 0
            ? 'No questions yet. Add one to get started!'
            : 'No questions match your filter.'}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2.5rem_1fr_7rem_5rem] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div></div>
            <div>Title</div>
            <div>Difficulty</div>
            <div className="text-center">Actions</div>
          </div>
          {filtered.map((question, idx) => (
            <QuestionRow
              key={question.id}
              question={question}
              isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      )}

      {showAddQuestion && (
        <AddQuestionModal topicId={topicId} onClose={() => setShowAddQuestion(false)} />
      )}
    </div>
  );
}
