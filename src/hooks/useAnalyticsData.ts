import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type AnalyticsTimeframe = '7d' | '30d' | 'all';

export interface UserMetricsSummary {
  totalUsers: number;
  activeUsers: number;
  averageGoalsCompleted: number;
  updatedAt: Date | null;
}

export interface OpportunityMetricsSummary {
  totalOpportunities: number;
  topCategories: Array<{ name: string; count: number }>;
  clicksPerOpportunity: Array<{ name: string; value: number }>;
  updatedAt: Date | null;
}

export interface AiMetricsSummary {
  totalInteractions: number;
  averageSessionsPerUser: number;
  topQueries: Array<{ label: string; count: number }>;
  updatedAt: Date | null;
}

export interface PlatformAnalytics {
  users: UserMetricsSummary;
  opportunities: OpportunityMetricsSummary;
  ai: AiMetricsSummary;
}

interface AnalyticsState {
  data: PlatformAnalytics;
  loading: boolean;
  error: string | null;
  timeframe: AnalyticsTimeframe;
}

const numericOrFallback = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const timestampOrNull = (value: unknown): Date | null => {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (value instanceof Date) {
    return value;
  }
  return null;
};

const fallbackAnalytics: PlatformAnalytics = {
  users: {
    totalUsers: 1280,
    activeUsers: 342,
    averageGoalsCompleted: 3.6,
    updatedAt: null
  },
  opportunities: {
    totalOpportunities: 214,
    topCategories: [
      { name: 'Tech careers', count: 68 },
      { name: 'Creative arts', count: 42 },
      { name: 'Entrepreneurship', count: 38 },
      { name: 'STEM scholarships', count: 34 }
    ],
    clicksPerOpportunity: [
      { name: 'Remote Product Apprenticeship', value: 182 },
      { name: 'Community Grant', value: 127 },
      { name: 'UI/UX Bootcamp', value: 96 },
      { name: 'STEM Mentorship', value: 74 }
    ],
    updatedAt: null
  },
  ai: {
    totalInteractions: 742,
    averageSessionsPerUser: 2.4,
    topQueries: [
      { label: 'CV review', count: 164 },
      { label: 'Scholarship prep', count: 139 },
      { label: 'Remote jobs', count: 128 }
    ],
    updatedAt: null
  }
};

const defaultState: AnalyticsState = {
  data: fallbackAnalytics,
  loading: true,
  error: null,
  timeframe: '7d'
};

const normaliseTopCategories = (value: unknown): Array<{ name: string; count: number }> => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') {
          return { name: entry, count: 1 };
        }
        if (entry && typeof entry === 'object') {
          const safeEntry = entry as Record<string, unknown>;
          const name = typeof safeEntry.name === 'string' ? safeEntry.name : String(safeEntry.label ?? 'Other');
          const count = numericOrFallback(safeEntry.count, 1);
          return { name, count };
        }
        return null;
      })
      .filter((entry): entry is { name: string; count: number } => Boolean(entry));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([name, count]) => ({
      name,
      count: numericOrFallback(count, 1)
    }));
  }
  return fallbackAnalytics.opportunities.topCategories;
};

const normaliseClicks = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }
        const safeEntry = entry as Record<string, unknown>;
        const name = typeof safeEntry.name === 'string' ? safeEntry.name : 'Opportunity';
        const count = numericOrFallback(safeEntry.value ?? safeEntry.count, 0);
        return { name, value: count };
      })
      .filter((entry): entry is { name: string; value: number } => Boolean(entry));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([name, count]) => ({
      name,
      value: numericOrFallback(count, 0)
    }));
  }

  return fallbackAnalytics.opportunities.clicksPerOpportunity;
};

const normaliseQueries = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') {
          return { label: entry, count: 1 };
        }
        if (entry && typeof entry === 'object') {
          const safeEntry = entry as Record<string, unknown>;
          const label = typeof safeEntry.label === 'string' ? safeEntry.label : String(safeEntry.query ?? 'Prompt');
          const count = numericOrFallback(safeEntry.count, 1);
          return { label, count };
        }
        return null;
      })
      .filter((entry): entry is { label: string; count: number } => Boolean(entry));
  }

  return fallbackAnalytics.ai.topQueries;
};

export function useAnalyticsData() {
  const [state, setState] = useState<AnalyticsState>(defaultState);

  const fetchAnalytics = useCallback(async () => {
    if (!db) {
      setState((previous) => ({
        ...previous,
        loading: false,
        error: 'Firestore is not initialised. Unable to load analytics.'
      }));
      return;
    }

    setState((previous) => ({
      ...previous,
      loading: true,
      error: null
    }));

    try {
      const [usersSnapshot, opportunitiesSnapshot, aiSnapshot] = await Promise.all([
        getDoc(doc(db, 'analytics', 'users')),
        getDoc(doc(db, 'analytics', 'opportunities')),
        getDoc(doc(db, 'analytics', 'ai'))
      ]);

      const usersData = usersSnapshot.data() as Record<string, unknown> | undefined;
      const opportunitiesData = opportunitiesSnapshot.data() as Record<string, unknown> | undefined;
      const aiData = aiSnapshot.data() as Record<string, unknown> | undefined;

      const analytics: PlatformAnalytics = {
        users: {
          totalUsers: numericOrFallback(usersData?.total, fallbackAnalytics.users.totalUsers),
          activeUsers: numericOrFallback(
            usersData?.activeThisWeek,
            fallbackAnalytics.users.activeUsers
          ),
          averageGoalsCompleted: numericOrFallback(
            usersData?.avgGoalsCompleted,
            fallbackAnalytics.users.averageGoalsCompleted
          ),
          updatedAt: timestampOrNull(usersData?.updatedAt ?? usersSnapshot?.updateTime?.toDate())
        },
        opportunities: {
          totalOpportunities: numericOrFallback(
            opportunitiesData?.total,
            fallbackAnalytics.opportunities.totalOpportunities
          ),
          topCategories: normaliseTopCategories(opportunitiesData?.topCategories),
          clicksPerOpportunity: normaliseClicks(opportunitiesData?.clicks),
          updatedAt: timestampOrNull(
            opportunitiesData?.updatedAt ?? opportunitiesSnapshot?.updateTime?.toDate()
          )
        },
        ai: {
          totalInteractions: numericOrFallback(
            aiData?.totalChats,
            fallbackAnalytics.ai.totalInteractions
          ),
          averageSessionsPerUser: numericOrFallback(
            aiData?.avgSessions,
            fallbackAnalytics.ai.averageSessionsPerUser
          ),
          topQueries: normaliseQueries(aiData?.topQueries),
          updatedAt: timestampOrNull(aiData?.updatedAt ?? aiSnapshot?.updateTime?.toDate())
        }
      };

      setState((previous) => ({
        ...previous,
        data: analytics,
        loading: false,
        error: null
      }));
    } catch (error) {
      console.error('Failed to load analytics dashboard data', error);
      setState((previous) => ({
        ...previous,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Unable to load analytics at this time.',
        data: previous.data ?? fallbackAnalytics
      }));
    }
  }, []);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const setTimeframe = useCallback((timeframe: AnalyticsTimeframe) => {
    setState((previous) => ({
      ...previous,
      timeframe
    }));
  }, []);

  const exportableRows = useMemo(() => {
    const { users, opportunities, ai } = state.data;
    return [
      ['Metric', 'Value'],
      ['Total users', users.totalUsers],
      ['Active users (timeframe)', users.activeUsers],
      ['Average goals completed', users.averageGoalsCompleted],
      ['Total opportunities', opportunities.totalOpportunities],
      ['Top categories', opportunities.topCategories.map((category) => category.name).join(', ')],
      ['Top opportunity clicks', opportunities.clicksPerOpportunity.map((item) => `${item.name} (${item.value})`).join('; ')],
      ['AI interactions', ai.totalInteractions],
      ['Average AI sessions per user', ai.averageSessionsPerUser],
      ['Top AI queries', ai.topQueries.map((query) => `${query.label} (${query.count})`).join('; ')]
    ];
  }, [state.data]);

  const toCsv = useCallback(() => {
    return exportableRows
      .map((cells) =>
        cells
          .map((cell) => {
            if (cell == null) {
              return '';
            }
            const stringValue = String(cell);
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',')
      )
      .join('\n');
  }, [exportableRows]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh: fetchAnalytics,
    timeframe: state.timeframe,
    setTimeframe,
    toCsv
  };
}

export default useAnalyticsData;
