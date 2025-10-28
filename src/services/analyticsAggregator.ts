import {
  doc,
  runTransaction,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { Opportunity } from '../types/opportunity';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_TOP_QUERY_ENTRIES = 10;
const MAX_CLICK_ENTRIES = 20;

interface UsersAggregateDoc {
  lastActive?: Record<string, number>;
  goalCompletions?: Record<string, number>;
  total?: number;
  activeThisWeek?: number;
  avgGoalsCompleted?: number;
}

interface OpportunitiesAggregateDoc {
  total?: number;
  topCategories?: Record<string, number>;
  clicks?: Record<string, number>;
}

interface AiAggregateDoc {
  sessionsPerUser?: Record<string, number>;
  topQueries?: Record<string, number>;
  totalChats?: number;
  avgSessions?: number;
}

const ensureDb = () => {
  if (!db) {
    throw new Error('Firestore is not initialised. Verify Firebase configuration.');
  }
  return db;
};

const now = () => Date.now();

const trimMapToTopEntries = (source: Record<string, number>, limit: number) => {
  const entries = Object.entries(source)
    .sort(([, left], [, right]) => right - left)
    .slice(0, limit);
  return entries.reduce<Record<string, number>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
};

export async function recordUserActivityAggregate(userId: string, options: { goalCompletedDelta?: number } = {}) {
  const database = ensureDb();
  const docRef = doc(database, 'analytics', 'users');
  const timestamp = now();

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const data = snapshot.exists() ? (snapshot.data() as UsersAggregateDoc) : {};

    const lastActive = { ...(data.lastActive ?? {}) };
    const goalCompletions = { ...(data.goalCompletions ?? {}) };

    lastActive[userId] = timestamp;

    if (options.goalCompletedDelta) {
      const nextValue = Math.max(0, (goalCompletions[userId] ?? 0) + options.goalCompletedDelta);
      goalCompletions[userId] = nextValue;
    }

    const totalUsers = Object.keys(lastActive).length;
    const activeCutoff = timestamp - WEEK_MS;
    const activeThisWeek = Object.values(lastActive).filter((value) => value >= activeCutoff).length;
    const totalGoalCompletions = Object.values(goalCompletions).reduce((sum, value) => sum + value, 0);
    const avgGoalsCompleted = totalUsers > 0 ? Number((totalGoalCompletions / totalUsers).toFixed(2)) : 0;

    transaction.set(
      docRef,
      {
        total: totalUsers,
        activeThisWeek,
        avgGoalsCompleted,
        lastActive,
        goalCompletions,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}

export async function syncUserGoalSummary(userId: string, completedGoals: number) {
  const database = ensureDb();
  const docRef = doc(database, 'analytics', 'users');
  const timestamp = now();

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const data = snapshot.exists() ? (snapshot.data() as UsersAggregateDoc) : {};

    const lastActive = { ...(data.lastActive ?? {}) };
    const goalCompletions = { ...(data.goalCompletions ?? {}) };

    lastActive[userId] = timestamp;
    goalCompletions[userId] = Math.max(0, completedGoals);

    const totalUsers = Object.keys(lastActive).length;
    const activeCutoff = timestamp - WEEK_MS;
    const activeThisWeek = Object.values(lastActive).filter((value) => value >= activeCutoff).length;
    const totalGoalCompletions = Object.values(goalCompletions).reduce((sum, value) => sum + value, 0);
    const avgGoalsCompleted = totalUsers > 0 ? Number((totalGoalCompletions / totalUsers).toFixed(2)) : 0;

    transaction.set(
      docRef,
      {
        total: totalUsers,
        activeThisWeek,
        avgGoalsCompleted,
        lastActive,
        goalCompletions,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}

export async function syncOpportunityInventorySnapshot(opportunities: Opportunity[]) {
  if (!opportunities.length) {
    return;
  }
  const database = ensureDb();
  const docRef = doc(database, 'analytics', 'opportunities');

  const total = opportunities.length;
  const categoryCounts = opportunities.reduce<Record<string, number>>((acc, opportunity) => {
    const category = opportunity.category || 'General';
    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  await setDoc(
    docRef,
    {
      total,
      topCategories: categoryCounts,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function recordOpportunityExploreAggregate(details: { id: string; title: string; category?: string }) {
  const database = ensureDb();
  const docRef = doc(database, 'analytics', 'opportunities');

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const data = snapshot.exists() ? (snapshot.data() as OpportunitiesAggregateDoc) : {};

    const clicks = { ...(data.clicks ?? {}) };
    const topCategories = { ...(data.topCategories ?? {}) };

    const titleKey = details.title || details.id;
    const categoryKey = details.category || 'General';

    clicks[titleKey] = (clicks[titleKey] ?? 0) + 1;
    topCategories[categoryKey] = (topCategories[categoryKey] ?? 0) + 1;

    const trimmedClicks = trimMapToTopEntries(clicks, MAX_CLICK_ENTRIES);

    transaction.set(
      docRef,
      {
        clicks: trimmedClicks,
        topCategories,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}

export async function recordChatSessionAggregate(userId: string, topic?: string) {
  const database = ensureDb();
  const docRef = doc(database, 'analytics', 'ai');

  await runTransaction(database, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    const data = snapshot.exists() ? (snapshot.data() as AiAggregateDoc) : {};

    const sessionsPerUser = { ...(data.sessionsPerUser ?? {}) };
    const topQueries = { ...(data.topQueries ?? {}) };

    sessionsPerUser[userId] = (sessionsPerUser[userId] ?? 0) + 1;

    const totalChats = Object.values(sessionsPerUser).reduce((sum, value) => sum + value, 0);
    const userCount = Object.keys(sessionsPerUser).length;
    const avgSessions = userCount > 0 ? Number((totalChats / userCount).toFixed(2)) : 0;

    if (topic) {
      topQueries[topic] = (topQueries[topic] ?? 0) + 1;
    }

    const trimmedQueries = trimMapToTopEntries(topQueries, MAX_TOP_QUERY_ENTRIES);

    transaction.set(
      docRef,
      {
        totalChats,
        avgSessions,
        topQueries: trimmedQueries,
        sessionsPerUser,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  });
}
