import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar.jsx';
import TopicView from './components/TopicView.jsx';
import OverallProgress from './components/OverallProgress.jsx';
import client from './api/client.js';
import { useTheme } from './contexts/ThemeContext.jsx';

function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
      style={{
        background: isDark ? 'rgba(147,51,234,0.15)' : 'rgba(236,72,153,0.1)',
        border: `1px solid ${isDark ? 'rgba(147,51,234,0.35)' : 'rgba(236,72,153,0.3)'}`,
      }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className="relative w-9 h-5 rounded-full transition-all duration-300 flex-shrink-0"
        style={{ background: isDark ? 'rgba(147,51,234,0.4)' : 'rgba(236,72,153,0.25)' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
          style={{
            left: isDark ? '18px' : '2px',
            background: isDark
              ? 'linear-gradient(135deg, #9333ea, #ec4899)'
              : 'linear-gradient(135deg, #ec4899, #fbbf24)',
            boxShadow: isDark ? '0 1px 4px rgba(147,51,234,0.6)' : '0 1px 4px rgba(236,72,153,0.5)',
          }}
        />
      </div>
      <span className="text-sm leading-none">
        {isDark ? '💜' : '☀️'}
      </span>
    </button>
  );
}

function BTSBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="bts-float-4"
        style={{
          position: 'absolute',
          bottom: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.28,
          filter: 'drop-shadow(0 0 40px rgba(236,72,153,0.5)) drop-shadow(0 0 80px rgba(147,51,234,0.35))',
        }}
      >
        <img src="/bts_wallpaper_bts (1).png" alt="BTS" style={{ width: '1000px', maxWidth: '90vw' }} />
      </div>
    </div>
  );
}

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTheme();

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: () => client.get('/topics').then((r) => r.data),
  });

  const effectiveTopicId =
    selectedTopicId && topics.some((t) => t._id === selectedTopicId)
      ? selectedTopicId
      : topics[0]?._id ?? null;

  const handleSelectTopic = (id) => {
    setSelectedTopicId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: t.bg, transition: 'background 0.3s ease', position: 'relative' }}>
      <BTSBackground />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar topics={topics} selectedTopicId={effectiveTopicId} onSelectTopic={handleSelectTopic} />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative" style={{ zIndex: 1 }}>
        {/* Top bar */}
        <div
          className="px-4 py-3 md:px-6 md:py-4 flex items-center gap-3 flex-shrink-0"
          style={{
            background: t.bgTopbar,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${t.borderTopbar}`,
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg transition-all flex-shrink-0"
            style={{ background: t.hamburgerBg, color: t.hamburgerColor }}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <OverallProgress topics={topics} />
          </div>
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {effectiveTopicId ? (
            <TopicView topicId={effectiveTopicId} topics={topics} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="text-5xl" style={{ opacity: 0.2 }}>✦</div>
              <p className="text-sm" style={{ color: t.emptyText }}>Select a topic to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
