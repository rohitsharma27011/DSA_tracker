import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';

export default function AddQuestionModal({ topicId, onClose }) {
  const [form, setForm] = useState({ title: '', url: '', difficulty: 'Easy' });
  const queryClient = useQueryClient();

  const addQuestion = useMutation({
    mutationFn: (data) => client.post(`/topics/${topicId}/questions`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', topicId] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.trim()) addQuestion.mutate(form);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Question</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Two Sum"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LeetCode URL
            </label>
            <input
              type="url"
              value={form.url}
              onChange={set('url')}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={set('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim() || addQuestion.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addQuestion.isPending ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
