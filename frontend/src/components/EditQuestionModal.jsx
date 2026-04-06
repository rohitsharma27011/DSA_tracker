import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

const DIFF_DOT = { Easy: '#4ade80', Medium: '#facc15', Hard: '#f87171' };
const DIFF_RGB  = { Easy: '34,197,94', Medium: '234,179,8', Hard: '239,68,68' };

export default function EditQuestionModal({ question, onClose }) {
  const [form, setForm] = useState({ title: question.title, url: question.url || '', difficulty: question.difficulty });
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const updateQuestion = useMutation({
    mutationFn: (data) => client.put(`/questions/${question.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['questions', question.topicId] }); onClose(); },
  });

  const handleSubmit = (e) => { e.preventDefault(); if (form.title.trim()) updateQuestion.mutate(form); };
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const inputStyle = {
    background: t.bgInput, border: `1px solid ${t.borderInput}`, color: t.textPrimary,
    borderRadius: '10px', outline: 'none', width: '100%', padding: '10px 12px',
    fontSize: '14px', transition: 'border 0.2s, box-shadow 0.2s',
  };
  const focusFn = (e) => { e.target.style.border = '1px solid rgba(124,58,237,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; };
  const blurFn  = (e) => { e.target.style.border = `1px solid ${t.borderInput}`; e.target.style.boxShadow = 'none'; };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: t.modalOverlay, backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-2xl p-6 fade-in-up"
        style={{ background: t.modalBg, border: '1px solid rgba(124,58,237,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>✎</div>
          <h3 className="text-base font-bold" style={{ color: t.textPrimary }}>Edit Question</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: t.textLabel }}>
              Title <span style={{ color: '#f87171' }}>*</span>
            </label>
            <input autoFocus type="text" value={form.title} onChange={set('title')}
              style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: t.textLabel }}>
              LeetCode URL
            </label>
            <input type="url" value={form.url} onChange={set('url')} placeholder="https://leetcode.com/problems/..."
              style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: t.textLabel }}>
              Difficulty
            </label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((d) => {
                const active = form.difficulty === d;
                const rgb = DIFF_RGB[d];
                return (
                  <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                    className="flex-1 py-2 text-xs font-bold rounded-xl transition-all"
                    style={{
                      background: active ? `rgba(${rgb},0.15)` : t.inactiveDiffBtn,
                      color: active ? DIFF_DOT[d] : t.textMuted,
                      border: `1px solid ${active ? `rgba(${rgb},0.4)` : t.inactiveDiffBtnBorder}`,
                      boxShadow: active ? `0 0 10px rgba(${rgb},0.2)` : 'none',
                    }}
                  >{d}</button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2.5 justify-end pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{ color: t.cancelBtnText, background: t.cancelBtn, border: `1px solid ${t.cancelBtnBorder}` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = t.cancelBtnHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = t.cancelBtnText; }}
            >Cancel</button>
            <button type="submit" disabled={!form.title.trim() || updateQuestion.isPending}
              className="px-4 py-2 text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.4)'; }}
            >{updateQuestion.isPending ? '...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
