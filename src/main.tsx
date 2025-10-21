import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoalsProvider } from './hooks/useGoals';
import { AnalyticsProvider } from './hooks/useAnalytics';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoalsProvider>
      <AnalyticsProvider>
        <App />
      </AnalyticsProvider>
    </GoalsProvider>
  </StrictMode>
);
