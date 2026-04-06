import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import AddTopicModal from './AddTopicModal.jsx';

function ProgressFraction({ completed, total }) {
  return (
    <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
      {completed}/{total}
    </span>
  );
}

export default function Sidebar({ topics, selectedTopicId, onSelectTopic }) {
  const [showAddTopic, setShowAddTopic] = useState(false);
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

  return (
    <>
      <aside className="w-64 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white tracking-tight">AeiRo DSA Space</h1>
          <p className="text-xs text-gray-400 mt-0.5">{topics.length} topics</p>
        </div>

        {/* Topic list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {topics.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            const pct =
              topic.totalCount > 0
                ? Math.round((topic.completedCount / topic.totalCount) * 100)
                : 0;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className={`group flex items-center px-4 py-2.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-sm font-medium truncate">{topic.name}</span>
                    <ProgressFraction
                      completed={topic.completedCount}
                      total={topic.totalCount}
                    />
                  </div>
                  {/* Mini progress bar */}
                  <div
                    className={`h-0.5 rounded-full ${
                      isSelected ? 'bg-blue-400' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`h-0.5 rounded-full transition-all ${
                        isSelected ? 'bg-white' : 'bg-green-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, topic.id)}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity text-xs flex-shrink-0"
                  title="Delete topic"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </nav>

        {/* Add topic button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setShowAddTopic(true)}
            className="w-full py-2 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            + Add Topic
          </button>
        </div>
      </aside>

      {showAddTopic && <AddTopicModal onClose={() => setShowAddTopic(false)} />}
    </>
  );
}
