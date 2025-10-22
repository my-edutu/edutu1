import React, { useState } from 'react';
import { useAdminCheck } from '../../../hooks/useAdminCheck';
import AnnouncementsManager from '../../../components/admin/community/AnnouncementsManager';
import SupportTickets from '../../../components/admin/community/SupportTickets';
import CommunityPosts from '../../../components/admin/community/CommunityPosts';
import MarketplaceModeration from '../../../components/admin/community/MarketplaceModeration';
import Badge from '../../../components/ui/Badge';

type TabKey = 'announcements' | 'support' | 'posts' | 'marketplace';

interface TabDefinition {
  key: TabKey;
  label: string;
}

const tabs: TabDefinition[] = [
  { key: 'announcements', label: 'Announcements' },
  { key: 'support', label: 'Support' },
  { key: 'posts', label: 'Community posts' },
  { key: 'marketplace', label: 'Roadmaps & marketplace' }
];

const CommunityAdminPage: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState<TabKey>('announcements');
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [openTicketCount, setOpenTicketCount] = useState(0);
  const [flaggedPostCount, setFlaggedPostCount] = useState(0);
  const [pendingMarketplaceCount, setPendingMarketplaceCount] = useState(0);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm text-gray-600">
        Checking admin privileges...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-center text-sm text-red-700">
        Community moderation tools are restricted to administrators. Contact the Edutu team for access.
      </div>
    );
  }

  const badgeContent: Record<TabKey, number> = {
    announcements: announcementCount,
    support: openTicketCount,
    posts: flaggedPostCount,
    marketplace: pendingMarketplaceCount
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">Community &amp; support</h1>
        <p className="text-sm text-gray-500">
          Publish announcements, close support tickets, and moderate community posts to keep Edutu healthy.
        </p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const count = badgeContent[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive ? 'bg-primary text-white shadow' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <Badge variant="outline" className={isActive ? 'border-white text-white' : undefined}>
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {activeTab === 'announcements' && <AnnouncementsManager onCountChange={setAnnouncementCount} />}
        {activeTab === 'support' && <SupportTickets onOpenCountChange={setOpenTicketCount} />}
        {activeTab === 'posts' && <CommunityPosts onFlaggedCountChange={setFlaggedPostCount} />}
        {activeTab === 'marketplace' && (
          <MarketplaceModeration onPendingCountChange={setPendingMarketplaceCount} />
        )}
      </div>
    </div>
  );
};

export default CommunityAdminPage;



