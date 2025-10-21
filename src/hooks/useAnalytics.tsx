import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';
import { usePersistentState } from './usePersistentState';
import { useGoals } from './useGoals';

type AnalyticsSnapshot = {
  opportunitiesExplored: number;
  chatSessions: number;
  activeDates: string[];
};

const ANALYTICS_STORAGE_KEY = 'edutu.analytics.v1';

const defaultSnapshot: AnalyticsSnapshot = {
  opportunitiesExplored: 0,
  chatSessions: 0,
  activeDates: []
};

interface AnalyticsStats {
  opportunitiesExplored: number;
  goalsAchieved: number;
  daysActive: number;
  chatSessions: number;
}

interface AnalyticsContextValue {
  stats: AnalyticsStats;
  recordOpportunityExplored: () => void;
  recordChatSession: () => void;
  recordActivity: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

const getTodayKey = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { goals } = useGoals();
  const [snapshot, setSnapshot] = usePersistentState<AnalyticsSnapshot>(
    ANALYTICS_STORAGE_KEY,
    defaultSnapshot
  );

  const recordActivity = useCallback(() => {
    const todayKey = getTodayKey();
    setSnapshot((previous) => {
      if (previous.activeDates.includes(todayKey)) {
        return previous;
      }

      const nextDates = [...previous.activeDates, todayKey].sort();
      return {
        ...previous,
        activeDates: nextDates
      };
    });
  }, [setSnapshot]);

  const recordOpportunityExplored = useCallback(() => {
    setSnapshot((previous) => ({
      ...previous,
      opportunitiesExplored: previous.opportunitiesExplored + 1
    }));
    recordActivity();
  }, [recordActivity, setSnapshot]);

  const recordChatSession = useCallback(() => {
    setSnapshot((previous) => ({
      ...previous,
      chatSessions: previous.chatSessions + 1
    }));
    recordActivity();
  }, [recordActivity, setSnapshot]);

  useEffect(() => {
    recordActivity();
  }, [recordActivity]);

  const goalsAchieved = useMemo(
    () => goals.filter((goal) => goal.status === 'completed').length,
    [goals]
  );

  const daysActive = useMemo(() => {
    return new Set(snapshot.activeDates).size;
  }, [snapshot.activeDates]);

  const stats = useMemo<AnalyticsStats>(
    () => ({
      opportunitiesExplored: snapshot.opportunitiesExplored,
      goalsAchieved,
      daysActive,
      chatSessions: snapshot.chatSessions
    }),
    [daysActive, goalsAchieved, snapshot.chatSessions, snapshot.opportunitiesExplored]
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      stats,
      recordActivity,
      recordOpportunityExplored,
      recordChatSession
    }),
    [recordActivity, recordChatSession, recordOpportunityExplored, stats]
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
