import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { GoalsProvider } from './hooks/useGoals';
import { AnalyticsProvider } from './hooks/useAnalytics';
import App from './App.tsx';
import AdminRoot from './admin/AdminRoot.tsx';
import { ToastProvider } from './components/ui/ToastProvider';

const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <GoalsProvider>
        <AnalyticsProvider>
          {isAdminRoute ? <AdminRoot /> : <App />}
        </AnalyticsProvider>
      </GoalsProvider>
    </ToastProvider>
  </StrictMode>
);
