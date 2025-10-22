import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { usePersistentState } from './usePersistentState';
import { useGoals, type Goal } from './useGoals';
import type { Opportunity } from '../types/opportunity';
import type {
  AppNotification,
  GoalReminderPreference,
  NotificationDraft,
  NotificationSeverity,
  PushPermissionState,
  ReminderPreferenceMap
} from '../types/notification';

const NOTIFICATIONS_STORAGE_KEY = 'edutu.notifications.v1';
const REMINDERS_STORAGE_KEY = 'edutu.reminders.v1';
const OPPORTUNITY_DIGEST_STORAGE_KEY = 'edutu.opportunityDigest.v1';
const MAX_INBOX_ITEMS = 120;

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  pushPermission: PushPermissionState;
  addNotification: (draft: NotificationDraft, options?: { silent?: boolean }) => AppNotification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  getReminderPreference: (goalId: string) => GoalReminderPreference | undefined;
  setReminderPreference: (
    goalId: string,
    updates: Partial<Omit<GoalReminderPreference, 'goalId'>>
  ) => void;
  removeReminderPreference: (goalId: string) => void;
  recordOpportunityHighlights: (opportunities: Opportunity[]) => void;
  requestPushPermission: () => Promise<NotificationPermission | 'unsupported'>;
  sendAdminBroadcast: (input: {
    title: string;
    body: string;
    severity?: NotificationSeverity;
    linkUrl?: string;
  }) => AppNotification;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

function createNotificationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `notif-${Math.random().toString(36).slice(2, 11)}`;
}

function normaliseDraft(draft: NotificationDraft): NotificationDraft {
  return {
    ...draft,
    title: draft.title.trim(),
    body: draft.body.trim()
  };
}

function shouldSendAgain(lastSent: string | null | undefined, hoursThreshold: number) {
  if (!lastSent) {
    return true;
  }
  const parsed = Date.parse(lastSent);
  if (Number.isNaN(parsed)) {
    return true;
  }
  const elapsedMs = Date.now() - parsed;
  return elapsedMs >= hoursThreshold * 60 * 60 * 1000;
}

function pickNextGoal(currentGoalId: string, goals: Goal[]): Goal | null {
  const priorityWeight: Record<string, number> = {
    high: 0,
    medium: 1,
    low: 2
  };

  const candidates = goals
    .filter((goal) => goal.id !== currentGoalId && goal.status === 'active')
    .sort((a, b) => {
      const aPriority = typeof a.priority === 'string' ? priorityWeight[a.priority] ?? 1 : 1;
      const bPriority = typeof b.priority === 'string' ? priorityWeight[b.priority] ?? 1 : 1;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      const aDeadline = a.deadline ? Date.parse(a.deadline) : Number.POSITIVE_INFINITY;
      const bDeadline = b.deadline ? Date.parse(b.deadline) : Number.POSITIVE_INFINITY;
      return aDeadline - bDeadline;
    });

  return candidates.length > 0 ? candidates[0] : null;
}

function buildReminderMessage(goal: Goal, goals: Goal[], cadence: 'daily' | 'weekly') {
  const nextGoal = pickNextGoal(goal.id, goals);
  const nextGoalLabel = nextGoal ? `"${nextGoal.title}" (${Math.round(nextGoal.progress)}% ready)` : 'staying consistent';
  const cadenceCopy =
    cadence === 'daily' ? 'Daily check-in' : 'Weekly focus review';

  return {
    title: `${cadenceCopy}: ${goal.title}`,
    body: `You're ${Math.round(goal.progress)}% through "${goal.title}". Next up: ${nextGoalLabel}.`
  };
}

function ensureReminderEntry(map: ReminderPreferenceMap, goalId: string): GoalReminderPreference {
  const existing = map[goalId];
  if (existing) {
    return existing;
  }
  return {
    goalId,
    daily: false,
    weekly: false,
    lastDailySentAt: null,
    lastWeeklySentAt: null
  };
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { goals } = useGoals();
  const [notifications, setNotifications] = usePersistentState<AppNotification[]>(
    NOTIFICATIONS_STORAGE_KEY,
    []
  );
  const [reminderPreferences, setReminderPreferences] = usePersistentState<ReminderPreferenceMap>(
    REMINDERS_STORAGE_KEY,
    {}
  );
  const [digestState, setDigestState] = usePersistentState(
    OPPORTUNITY_DIGEST_STORAGE_KEY,
    {
      seenOpportunityIds: [] as string[],
      lastDigestAt: null as string | null
    }
  );
  const [pushPermission, setPushPermission] = useState<PushPermissionState>('unsupported');

  const remindersRef = useRef(reminderPreferences);
  const goalsRef = useRef(goals);
  const digestStateRef = useRef(digestState);

  useEffect(() => {
    remindersRef.current = reminderPreferences;
  }, [reminderPreferences]);

  useEffect(() => {
    goalsRef.current = goals;
  }, [goals]);

  useEffect(() => {
    digestStateRef.current = digestState;
  }, [digestState]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (!('Notification' in window)) {
      setPushPermission('unsupported');
      return;
    }
    setPushPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as AppNotification[];
          setNotifications(parsed);
        } catch (error) {
          console.warn('Unable to sync notifications from storage', error);
        }
        return;
      }

      if (event.key === REMINDERS_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as ReminderPreferenceMap;
          setReminderPreferences(parsed);
        } catch (error) {
          console.warn('Unable to sync reminder preferences from storage', error);
        }
        return;
      }

      if (event.key === OPPORTUNITY_DIGEST_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as typeof digestStateRef.current;
          setDigestState(parsed);
        } catch (error) {
          console.warn('Unable to sync opportunity digest state', error);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [setDigestState, setNotifications, setReminderPreferences]);

  useEffect(() => {
    const activeGoalIds = new Set(goals.map((goal) => goal.id));
    let mutated = false;
    const nextState: ReminderPreferenceMap = {};
    Object.entries(reminderPreferences).forEach(([goalId, value]) => {
      if (activeGoalIds.has(goalId)) {
        nextState[goalId] = value;
      } else {
        mutated = true;
      }
    });
    if (mutated) {
      setReminderPreferences(nextState);
    }
  }, [goals, reminderPreferences, setReminderPreferences]);

  const maybeShowNativeNotification = useCallback(
    (entry: AppNotification) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
      }
      if (!('Notification' in window)) {
        return;
      }
      if (pushPermission !== 'granted') {
        return;
      }

      try {
        const isWindowVisible = document.visibilityState === 'visible';
        if (isWindowVisible) {
          return;
        }
        new Notification(entry.title, {
          body: entry.body,
          tag: entry.id,
          data: entry.metadata ?? {}
        });
      } catch (error) {
        console.warn('Unable to display native notification', error);
      }
    },
    [pushPermission]
  );

  const addNotification = useCallback(
    (input: NotificationDraft, options?: { silent?: boolean }) => {
      const draft = normaliseDraft(input);
      const now = new Date().toISOString();

      let createdEntry: AppNotification | null = null;
      setNotifications((prev) => {
        if (
          draft.dedupeKey &&
          prev.some((existing) => existing.dedupeKey === draft.dedupeKey)
        ) {
          const already = prev.find((existing) => existing.dedupeKey === draft.dedupeKey);
          if (already) {
            createdEntry = already;
          }
          return prev;
        }

        const entry: AppNotification = {
          id: createNotificationId(),
          kind: draft.kind,
          title: draft.title,
          body: draft.body,
          createdAt: now,
          readAt: null,
          severity: draft.severity ?? 'info',
          metadata: draft.metadata,
          dedupeKey: draft.dedupeKey
        };
        createdEntry = entry;
        return [entry, ...prev].slice(0, MAX_INBOX_ITEMS);
      });

      if (!options?.silent && createdEntry) {
        maybeShowNativeNotification(createdEntry);
      }

      return createdEntry ?? {
        id: createNotificationId(),
        kind: draft.kind,
        title: draft.title,
        body: draft.body,
        createdAt: now,
        readAt: now,
        severity: draft.severity ?? 'info',
        metadata: draft.metadata,
        dedupeKey: draft.dedupeKey
      };
    },
    [maybeShowNativeNotification, setNotifications]
  );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id && item.readAt === null
            ? { ...item, readAt: new Date().toISOString() }
            : item
        )
      );
    },
    [setNotifications]
  );

  const markAllAsRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((item) => (item.readAt ? item : { ...item, readAt: now }))
    );
  }, [setNotifications]);

  const deleteNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    },
    [setNotifications]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  const getReminderPreference = useCallback(
    (goalId: string) => reminderPreferences[goalId],
    [reminderPreferences]
  );

  const setReminderPreference = useCallback(
    (goalId: string, updates: Partial<Omit<GoalReminderPreference, 'goalId'>>) => {
      setReminderPreferences((prev) => {
        const nextEntry = {
          ...ensureReminderEntry(prev, goalId),
          ...updates,
          goalId
        };

        if (!nextEntry.daily && !nextEntry.weekly) {
          const { [goalId]: _removed, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [goalId]: nextEntry
        };
      });
    },
    [setReminderPreferences]
  );

  const removeReminderPreference = useCallback(
    (goalId: string) => {
      setReminderPreferences((prev) => {
        if (!(goalId in prev)) {
          return prev;
        }
        const { [goalId]: _removed, ...rest } = prev;
        return rest;
      });
    },
    [setReminderPreferences]
  );

  const touchReminderSent = useCallback(
    (goalId: string, cadence: 'daily' | 'weekly') => {
      const field = cadence === 'daily' ? 'lastDailySentAt' : 'lastWeeklySentAt';
      setReminderPreferences((prev) => {
        const entry = prev[goalId];
        if (!entry) {
          return prev;
        }
        return {
          ...prev,
          [goalId]: {
            ...entry,
            [field]: new Date().toISOString()
          }
        };
      });
    },
    [setReminderPreferences]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkReminders = () => {
      const activeGoals = goalsRef.current;
      if (activeGoals.length === 0) {
        return;
      }

      const prefs = remindersRef.current;
      const now = new Date();

      activeGoals.forEach((goal) => {
        const preference = prefs[goal.id];
        if (!preference) {
          return;
        }

        if (preference.daily && shouldSendAgain(preference.lastDailySentAt, 24)) {
          const { title, body } = buildReminderMessage(goal, activeGoals, 'daily');
          addNotification(
            {
              kind: 'goal-reminder',
              title,
              body,
              severity: 'info',
              metadata: {
                goalId: goal.id,
                cadence: 'daily',
                triggeredAt: now.toISOString()
              },
              dedupeKey: `goal-${goal.id}-daily-${now.toDateString()}`
            },
            { silent: false }
          );
          touchReminderSent(goal.id, 'daily');
        }

        if (preference.weekly && shouldSendAgain(preference.lastWeeklySentAt, 24 * 7)) {
          const { title, body } = buildReminderMessage(goal, activeGoals, 'weekly');
          addNotification(
            {
              kind: 'goal-weekly-digest',
              title,
              body,
              severity: 'success',
              metadata: {
                goalId: goal.id,
                cadence: 'weekly',
                triggeredAt: now.toISOString()
              },
              dedupeKey: `goal-${goal.id}-weekly-${now.getFullYear()}-${now.getWeek?.() ?? now.getMonth()}-${now.getDay()}`
            },
            { silent: false }
          );
          touchReminderSent(goal.id, 'weekly');
        }
      });
    };

    const initialTimer = window.setTimeout(checkReminders, 2000);
    const interval = window.setInterval(checkReminders, 15 * 60 * 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [addNotification, touchReminderSent]);

  const recordOpportunityHighlights = useCallback(
    (opportunities: Opportunity[]) => {
      if (!Array.isArray(opportunities) || opportunities.length === 0) {
        return;
      }

      setDigestState((prev) => {
        const seen = new Set(prev.seenOpportunityIds);
        const topMatches = opportunities.slice(0, 3).filter((item) => item && item.id);
        const freshEntries = topMatches.filter((item) => !seen.has(item.id));

        if (freshEntries.length === 0) {
          return prev;
        }

        freshEntries.forEach((item, index) => {
          const matchScore = typeof item.match === 'number' ? Math.round(item.match) : undefined;
          const scoreCopy = typeof matchScore === 'number' ? `Match score ${matchScore}%` : 'Fresh opportunity waiting for you';
          addNotification(
            {
              kind: 'opportunity-highlight',
              title: `New top match: ${item.title}`,
              body: `${scoreCopy} • ${item.organization}`,
              severity: 'success',
              metadata: {
                opportunityId: item.id,
                rank: index + 1
              },
              dedupeKey: `opportunity-${item.id}`
            },
            { silent: index > 0 }
          );
        });

        const updatedSeen = Array.from(
          new Set([...prev.seenOpportunityIds, ...freshEntries.map((item) => item.id)])
        ).slice(-60);

        return {
          seenOpportunityIds: updatedSeen,
          lastDigestAt: new Date().toISOString()
        };
      });
    },
    [addNotification, setDigestState]
  );

  const requestPushPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushPermission('unsupported');
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      setPushPermission('granted');
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    setPushPermission(permission);
    return permission;
  }, []);

  const sendAdminBroadcast = useCallback(
    (input: { title: string; body: string; severity?: NotificationSeverity; linkUrl?: string }) => {
      const entry = addNotification(
        {
          kind: 'admin-broadcast',
          title: input.title,
          body: input.body,
          severity: input.severity ?? 'warning',
          metadata: {
            linkUrl: input.linkUrl,
            issuedAt: new Date().toISOString()
          }
        },
        { silent: false }
      );
      return entry;
    },
    [addNotification]
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.readAt).length,
    [notifications]
  );

  const contextValue = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      pushPermission,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearNotifications,
      getReminderPreference,
      setReminderPreference,
      removeReminderPreference,
      recordOpportunityHighlights,
      requestPushPermission,
      sendAdminBroadcast
    }),
    [
      notifications,
      unreadCount,
      pushPermission,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearNotifications,
      getReminderPreference,
      setReminderPreference,
      removeReminderPreference,
      recordOpportunityHighlights,
      requestPushPermission,
      sendAdminBroadcast
    ]
  );

  return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>;
};

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

