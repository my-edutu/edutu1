import React from 'react';
import { useAdminCheck } from '../../../hooks/useAdminCheck';
import AnalyticsDashboard from '../../../components/admin/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  const { isAdmin, loading } = useAdminCheck();

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
        Analytics insights are restricted to administrators. Please request access from the Edutu team.
      </div>
    );
  }

  return <AnalyticsDashboard />;
};

export default AnalyticsPage;
