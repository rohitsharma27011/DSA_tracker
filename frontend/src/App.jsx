import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from './components/Sidebar.jsx';
import TopicView from './components/TopicView.jsx';
import OverallProgress from './components/OverallProgress.jsx';
import client from './api/client.js';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: () => client.get('/topics').then((r) => r.data),
    onSuccess: (data) => {
      if (!selectedTopicId && data.length > 0) {
        setSelectedTopicId(data[0].id);
      }
    },
  });

  // Auto-select first topic once loaded
  const effectiveTopicId =
    selectedTopicId && topics.some((t) => t.id === selectedTopicId)
      ? selectedTopicId
      : topics[0]?.id ?? null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        topics={topics}
        selectedTopicId={effectiveTopicId}
        onSelectTopic={setSelectedTopicId}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-white">
          <OverallProgress topics={topics} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {effectiveTopicId ? (
            <TopicView
              topicId={effectiveTopicId}
              topics={topics}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a topic from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
