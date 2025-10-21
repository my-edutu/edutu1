import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Announcements from './Announcements';
import SupportTickets from './SupportTickets';

const CommunityPosts: React.FC = () => {
  const rows = [
    {
      id: 'roadmap-boost',
      title: 'Remote Product Design Circle',
      author: 'Kwame A.',
      flaggedBy: 'Auto-moderator',
      status: 'Pending review',
      submittedAt: new Date().toLocaleDateString()
    },
    {
      id: 'scholarship-tips',
      title: 'Top 5 scholarship pitch mistakes',
      author: 'Fatima M.',
      flaggedBy: 'Community report',
      status: 'Cleared',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString()
    },
    {
      id: 'marketplace-feedback',
      title: 'Marketplace payment issue',
      author: 'Support Bot',
      flaggedBy: 'System',
      status: 'Investigating',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Community posts</h1>
        <p className="text-sm text-gray-500">
          Monitor featured posts, flagged threads, and marketplace feedback to keep the community healthy.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Flagged by</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-gray-900">{row.title}</td>
                <td className="px-4 py-4 text-gray-700">{row.author}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{row.flaggedBy}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{row.status}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{row.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommunitySupportRoutes: React.FC = () => {
  const navItems = [
    { to: 'announcements', label: 'Announcements' },
    { to: 'support-tickets', label: 'Support tickets' },
    { to: 'community-posts', label: 'Community posts' }
  ];

  const hasAdminAccess = true;

  if (!hasAdminAccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-center text-sm text-red-700">
        Access to community &amp; support tools is restricted. Ensure you have admin privileges.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <nav className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                isActive ? 'bg-primary text-white shadow' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
              ].join(' ')
            }
            end
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route index element={<Navigate to="announcements" replace />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="support-tickets" element={<SupportTickets />} />
        <Route path="community-posts" element={<CommunityPosts />} />
        <Route path="*" element={<Navigate to="announcements" replace />} />
      </Routes>
    </div>
  );
};

export default CommunitySupportRoutes;
