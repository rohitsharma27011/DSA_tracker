import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar.jsx';
import TopicView from './components/TopicView.jsx';
import OverallProgress from './components/OverallProgress.jsx';
import client from './api/client.js';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: () => client.get('/topics').then((r) => r.data),
  });

  const effectiveTopicId =
    selectedTopicId && topics.some((t) => t.id === selectedTopicId)
      ? selectedTopicId
      : topics[0]?.id ?? null;

  const handleSelectTopic = (id) => {
    setSelectedTopicId(id);
    setSidebarOpen(false); // close drawer on mobile after picking a topic
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on md+ */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          topics={topics}
          selectedTopicId={effectiveTopicId}
          onSelectTopic={handleSelectTopic}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 bg-white flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <OverallProgress topics={topics} />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {effectiveTopicId ? (
            <TopicView topicId={effectiveTopicId} topics={topics} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <p>Select a topic from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
