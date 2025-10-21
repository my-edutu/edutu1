import React, { useState } from 'react';
import { useAdminCheck } from '../../../hooks/useAdminCheck';
import AIMentorConfig from '../../../components/admin/ai/AIMentorConfig';
import RecommendationTuner from '../../../components/admin/ai/RecommendationTuner';
import RAGDataManager from '../../../components/admin/ai/RAGDataManager';

type TabKey = 'mentors' | 'tuning' | 'rag';

const tabs: Array<{ key: TabKey; label: string; helper: string }> = [
  {
    key: 'mentors',
    label: 'Mentor config',
    helper: 'Edit prompts and tone for AI personas.'
  },
  {
    key: 'tuning',
    label: 'Recommendation tuning',
    helper: 'Adjust opportunity recommendation weights.'
  },
  {
    key: 'rag',
    label: 'Data sources',
    helper: 'Manage retrieval sources feeding the AI.'
  }
];

const AiControlPage: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState<TabKey>('mentors');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-600">
        Checking admin privileges…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-center text-sm text-red-700">
        AI controls are restricted to administrators. Contact the Edutu team to request access.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">AI &amp; personalisation control</h1>
        <p className="text-sm text-gray-500">
          Configure prompts, adjust recommendation weights, and monitor data sources powering Edutu&apos;s AI mentors.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-primary text-white shadow' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">{tabs.find((tab) => tab.key === activeTab)?.helper}</p>
        <div className="mt-6 space-y-6">
          {activeTab === 'mentors' && <AIMentorConfig />}
          {activeTab === 'tuning' && <RecommendationTuner />}
          {activeTab === 'rag' && <RAGDataManager />}
        </div>
      </div>
    </div>
  );
};

export default AiControlPage;
