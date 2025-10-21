import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../../components/admin/layout/Sidebar';
import Topbar from '../../components/admin/layout/Topbar';
import { useAdminCheck } from '../../hooks/useAdminCheck';
import Button from '../../components/ui/Button';

const loadingCopy = [
  'Verifying your admin credentials...',
  'Fetching the latest control panel updates...',
  'Calibrating Edutu insights for administrators...'
];

const pickLoadingMessage = () => {
  const randomIndex = Math.floor(Math.random() * loadingCopy.length);
  return loadingCopy[randomIndex];
};

const AdminLayout: React.FC = () => {
  const { isAdmin, loading, user } = useAdminCheck();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingMessage] = useState(pickLoadingMessage);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-body text-soft">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-dashed border-brand-300/60 bg-brand-50/70 text-brand-600 shadow-soft">
          <span className="text-sm font-semibold">Ed</span>
        </div>
        <p className="text-sm font-medium">{loadingMessage}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-body px-4 text-center text-soft">
        <div className="max-w-md space-y-3 rounded-3xl border border-danger/20 bg-surface-layer px-6 py-8 shadow-soft">
          <h1 className="text-xl font-semibold text-strong">Access denied</h1>
          <p className="text-sm text-muted">
            Admin privileges are required to access the control center. If you believe this is an
            error, contact the Edutu operations team to request access.
          </p>
          <Button
            type="button"
            size="sm"
            variant="primary"
            className="w-full justify-center"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
          >
            Return to app
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-body text-strong">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:pl-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} user={user} />
        <main className="relative flex-1 overflow-y-auto px-4 pb-12 pt-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24, ease: [0.215, 0.61, 0.355, 1] }}
              className="mx-auto w-full max-w-[1440px] space-y-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
