import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import client from '../api/client.js';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function AddTopicModal({ onClose }) {
  const [name, setName] = useState('');
  const { t } = useTheme();
  const queryClient = useQueryClient();

  const addTopic = useMutation({
    mutationFn: (name) => client.post('/topics', { name }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['topics'] }); onClose(); },
  });

  const handleSubmit = (e) => { e.preventDefault(); if (name.trim()) addTopic.mutate(name.trim()); };

  const inputStyle = {
    background: t.bgInput, border: `1px solid ${t.borderInput}`, color: t.textPrimary,
    borderRadius: '10px', outline: 'none', width: '100%', padding: '10px 12px',
    fontSize: '14px', transition: 'border 0.2s, box-shadow 0.2s',
  };

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
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>✦</div>
          <h3 className="text-base font-bold" style={{ color: t.textPrimary }}>New Topic</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: t.textLabel }}>
              Topic Name
            </label>
            <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Binary Search" style={inputStyle}
              onFocus={(e) => { e.target.style.border = '1px solid rgba(124,58,237,0.6)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)'; }}
              onBlur={(e) => { e.target.style.border = `1px solid ${t.borderInput}`; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div className="flex gap-2.5 justify-end pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{ color: t.cancelBtnText, background: t.cancelBtn, border: `1px solid ${t.cancelBtnBorder}` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = t.cancelBtnHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = t.cancelBtnText; }}
            >Cancel</button>
            <button type="submit" disabled={!name.trim() || addTopic.isPending}
              className="px-4 py-2 text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.6)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.4)'; }}
            >{addTopic.isPending ? '...' : 'Create Topic'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
