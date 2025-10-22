import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit as limitQuery,
  onSnapshot,
  orderBy as orderByQuery,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type {
  CommunityModeratorNote,
  CommunityResource,
  CommunityRoadmapStage,
  CommunityStory,
  CommunityStoryQueryOptions,
  CommunityStoryStats,
  CommunityStoryStatus,
  CommunityStorySubmissionInput,
  CommunityStoryType,
  CommunityStoryUpdateInput
} from '../types/community';

const COLLECTION_NAME = 'community_marketplace';

type FirestoreRecord = Record<string, unknown>;

const collectionRef = collection(db, COLLECTION_NAME);

interface ListenHandlers {
  onNext: (stories: CommunityStory[]) => void;
  onError?: (error: Error) => void;
}

export function listenToCommunityStories(
  options: CommunityStoryQueryOptions,
  handlers: ListenHandlers
) {
  const { onNext, onError } = handlers;
  const constraints = buildQueryConstraints(options);
  const storiesQuery = query(collectionRef, ...constraints);

  return onSnapshot(
    storiesQuery,
    (snapshot) => {
      const stories = snapshot.docs.map((docSnapshot) =>
        mapFirestoreStory(docSnapshot.id, docSnapshot.data() as FirestoreRecord)
      );
      onNext(stories);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('listenToCommunityStories', error);
      }
    }
  );
}

export async function fetchCommunityStories(
  options: CommunityStoryQueryOptions
): Promise<CommunityStory[]> {
  const constraints = buildQueryConstraints(options);
  const storiesQuery = query(collectionRef, ...constraints);
  const snapshot = await getDocs(storiesQuery);

  return snapshot.docs.map((docSnapshot) =>
    mapFirestoreStory(docSnapshot.id, docSnapshot.data() as FirestoreRecord)
  );
}

export async function getCommunityStory(id: string): Promise<CommunityStory | null> {
  const ref = doc(collectionRef, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return null;
  }
  return mapFirestoreStory(snapshot.id, snapshot.data() as FirestoreRecord);
}

export async function submitCommunityStory(input: CommunityStorySubmissionInput) {
  const now = serverTimestamp();

  const payload: FirestoreRecord = {
    title: input.title.trim(),
    summary: input.summary.trim(),
    story: input.story?.trim() || input.summary.trim(),
    category: input.category?.trim() || 'Community',
    duration: input.duration?.trim() || null,
    difficulty: normaliseDifficulty(input.difficulty),
    priceType: normalisePrice(input.price),
    successRate: clampNumber(input.successRate ?? 60, 1, 100),
    tags: normaliseArray(input.tags),
    outcomes: normaliseArray(input.outcomes),
    coverImage: input.coverImage?.trim() || null,
    creator: {
      name: input.creator.name.trim(),
      title: input.creator.title?.trim() || null,
      avatar: input.creator.avatar?.trim() || null,
      email: input.creator.email?.trim() || null,
      verified: Boolean(input.creator.verified)
    },
    resources: normaliseResources(input.resources),
    roadmap: normaliseRoadmap(input.roadmap),
    type: input.type ?? 'roadmap',
    status: 'pending',
    featured: false,
    featuredRank: null,
    stats: defaultStats(),
    creatorNotes: input.creatorNotes?.trim() || null,
    moderatorNotes: [],
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    approvedBy: null
  };

  return addDoc(collectionRef, payload);
}

export async function updateCommunityStory(id: string, updates: CommunityStoryUpdateInput) {
  const ref = doc(collectionRef, id);
  const payload: FirestoreRecord = {
    updatedAt: serverTimestamp()
  };

  if (updates.title !== undefined) payload.title = updates.title?.trim() || null;
  if (updates.summary !== undefined) payload.summary = updates.summary?.trim() || null;
  if (updates.story !== undefined) payload.story = updates.story?.trim() || null;
  if (updates.category !== undefined) payload.category = updates.category?.trim() || null;
  if (updates.duration !== undefined) payload.duration = updates.duration?.trim() || null;
  if (updates.difficulty !== undefined) payload.difficulty = normaliseDifficulty(updates.difficulty);
  if (updates.price !== undefined) payload.priceType = normalisePrice(updates.price);
  if (updates.successRate !== undefined) payload.successRate = clampNumber(updates.successRate, 1, 100);
  if (updates.tags !== undefined) payload.tags = normaliseArray(updates.tags);
  if (updates.outcomes !== undefined) payload.outcomes = normaliseArray(updates.outcomes);
  if (updates.image !== undefined) payload.coverImage = updates.image?.trim() || null;
  if (updates.resources !== undefined) payload.resources = normaliseResources(updates.resources);
  if (updates.roadmap !== undefined) payload.roadmap = normaliseRoadmap(updates.roadmap);
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.featured !== undefined) payload.featured = updates.featured;
  if (updates.featuredRank !== undefined) payload.featuredRank = updates.featuredRank ?? null;
  if (updates.moderatorNotes !== undefined) payload.moderatorNotes = serialiseModeratorNotes(updates.moderatorNotes);
  if (updates.approvedBy !== undefined) payload.approvedBy = updates.approvedBy ?? null;
  if (updates.approvedAt !== undefined) payload.approvedAt = updates.approvedAt
    ? Timestamp.fromMillis(new Date(updates.approvedAt).getTime())
    : null;
  if (updates.stats !== undefined) {
    payload.stats = {
      ...defaultStats(),
      ...updates.stats
    };
  }
  if (updates.creator !== undefined) {
    payload.creator = {
      ...(updates.creator.name ? { name: updates.creator.name.trim() } : undefined),
      ...(updates.creator.title !== undefined ? { title: updates.creator.title?.trim() || null } : undefined),
      ...(updates.creator.avatar !== undefined ? { avatar: updates.creator.avatar?.trim() || null } : undefined),
      ...(updates.creator.email !== undefined ? { email: updates.creator.email?.trim() || null } : undefined),
      ...(updates.creator.verified !== undefined ? { verified: Boolean(updates.creator.verified) } : undefined)
    };
  }

  return updateDoc(ref, payload);
}

export async function setCommunityStoryStatus(
  id: string,
  status: CommunityStoryStatus,
  metadata?: { approvedBy?: string }
) {
  const ref = doc(collectionRef, id);
  const isApproved = status === 'approved';

  return updateDoc(ref, {
    status,
    approvedAt: isApproved ? serverTimestamp() : null,
    approvedBy: isApproved ? metadata?.approvedBy ?? null : null,
    updatedAt: serverTimestamp()
  });
}

export async function setCommunityStoryFeatured(
  id: string,
  featured: boolean,
  featuredRank?: number | null
) {
  const ref = doc(collectionRef, id);
  return updateDoc(ref, {
    featured,
    featuredRank: featured ? featuredRank ?? 0 : null,
    updatedAt: serverTimestamp()
  });
}

export async function recordCommunityStoryAdoption(id: string) {
  const ref = doc(collectionRef, id);
  return updateDoc(ref, {
    'stats.adoptionCount': increment(1),
    'stats.users': increment(1),
    updatedAt: serverTimestamp()
  });
}

export async function recordCommunityStoryLike(id: string) {
  const ref = doc(collectionRef, id);
  return updateDoc(ref, {
    'stats.likes': increment(1),
    updatedAt: serverTimestamp()
  });
}

export async function recordCommunityStorySave(id: string) {
  const ref = doc(collectionRef, id);
  return updateDoc(ref, {
    'stats.saves': increment(1),
    updatedAt: serverTimestamp()
  });
}

export async function appendModeratorNote(
  id: string,
  entry: { note: string; author?: string }
) {
  const ref = doc(collectionRef, id);
  const trimmedNote = entry.note.trim();
  if (!trimmedNote) {
    return Promise.resolve();
  }
  return updateDoc(ref, {
    moderatorNotes: arrayUnion({
      id: createId(),
      note: trimmedNote,
      author: entry.author?.trim() || null,
      createdAt: serverTimestamp()
    }),
    updatedAt: serverTimestamp()
  });
}

function buildQueryConstraints(options: CommunityStoryQueryOptions) {
  const constraints = [];

  if (options.status) {
    if (Array.isArray(options.status)) {
      if (options.status.length === 1) {
        constraints.push(where('status', '==', options.status[0]));
      } else {
        constraints.push(where('status', 'in', options.status.slice(0, 10)));
      }
    } else {
      constraints.push(where('status', '==', options.status));
    }
  }

  if (options.type) {
    if (Array.isArray(options.type)) {
      if (options.type.length === 1) {
        constraints.push(where('type', '==', options.type[0]));
      } else {
        constraints.push(where('type', 'in', options.type.slice(0, 10)));
      }
    } else {
      constraints.push(where('type', '==', options.type));
    }
  }

  if (options.category) {
    constraints.push(where('category', '==', options.category));
  }

  if (options.featuredOnly) {
    constraints.push(where('featured', '==', true));
  }

  const orderByField = options.orderBy ?? (options.featuredOnly ? 'featuredRank' : 'updatedAt');
  const descending = options.descending ?? true;
  constraints.push(orderByQuery(orderByField, descending ? 'desc' : 'asc'));

  if (options.limit && Number.isFinite(options.limit)) {
    constraints.push(limitQuery(options.limit));
  }

  return constraints;
}

function mapFirestoreStory(id: string, payload: FirestoreRecord): CommunityStory {
  const creator = normaliseCreator(payload);
  const price = payload.priceType === 'premium' ? 'Premium' : 'Free';
  const successRate = clampNumber(readNumber(payload.successRate, 60), 1, 100);
  const createdAtDate = readTimestamp(payload.createdAt);
  const updatedAtDate = readTimestamp(payload.updatedAt ?? payload.lastUpdated ?? payload.createdAt);
  const lastUpdatedDate = updatedAtDate ?? createdAtDate ?? new Date();

  const stats = normaliseStats(payload, successRate);

  return {
    id,
    title: safeString(payload.title) || 'Untitled submission',
    summary: safeString(payload.summary) || safeString(payload.description) || 'Awaiting description.',
    story: safeString(payload.story) || safeString(payload.description) || '',
    category: safeString(payload.category) || 'Community',
    duration: safeString(payload.duration),
    difficulty: normaliseDifficulty(payload.difficulty),
    price,
    successRate: clampNumber(stats.successRate ?? successRate, 1, 100),
    image: ensureImage(payload.coverImage, payload.image, safeString(payload.category)),
    creator,
    tags: normaliseArray(payload.tags),
    outcomes: normaliseArray(payload.outcomes ?? payload.achievements),
    resources: normaliseResources(payload.resources),
    roadmap: normaliseRoadmap(payload.roadmap),
    status: normaliseStatus(payload.status),
    type: normaliseType(payload.type),
    featured: Boolean(payload.featured),
    featuredRank: typeof payload.featuredRank === 'number' ? payload.featuredRank : null,
    createdAt: createdAtDate ? createdAtDate.toISOString() : null,
    updatedAt: updatedAtDate ? updatedAtDate.toISOString() : null,
    approvedAt: readTimestamp(payload.approvedAt)?.toISOString() ?? null,
   approvedBy: safeString(payload.approvedBy) || null,
    moderatorNotes: normaliseModeratorNotes(payload.moderatorNotes),
    stats,
    lastUpdatedLabel: formatRelativeDate(lastUpdatedDate),
    lastUpdatedTimestamp: lastUpdatedDate.getTime()
  };
}

function normaliseCreator(payload: FirestoreRecord) {
  const creator = payload.creator as FirestoreRecord | undefined;
  if (creator && typeof creator === 'object') {
    return {
      name: safeString(creator.name) || safeString(payload.creatorName) || 'Community creator',
      title: safeString(creator.title) || safeString(payload.creatorTitle) || undefined,
      avatar: safeString(creator.avatar) || undefined,
      email: safeString(creator.email) || safeString(payload.creatorEmail) || undefined,
      verified:
        typeof creator.verified === 'boolean'
          ? creator.verified
          : Boolean(payload.creatorVerified)
    };
  }

  return {
    name: safeString(payload.creatorName) || 'Community creator',
    title: safeString(payload.creatorTitle) || undefined,
    avatar: undefined,
    email: safeString(payload.creatorEmail) || undefined,
    verified: Boolean(payload.creatorVerified)
  };
}

function normaliseStats(payload: FirestoreRecord, successRateFallback: number): CommunityStoryStats {
  const statsPayload = (payload.stats as FirestoreRecord | undefined) ?? {};

  const rating = clampNumber(
    readNumber(statsPayload.rating ?? payload.rating, 4.7),
    0,
    5
  );
  const users = clampNumber(
    readNumber(statsPayload.users ?? payload.users ?? payload.submissions, 0),
    0,
    Number.MAX_SAFE_INTEGER
  );
  const successRate = clampNumber(readNumber(statsPayload.successRate ?? payload.successRate, successRateFallback), 1, 100);
  const saves = clampNumber(readNumber(statsPayload.saves ?? payload.saves, 0), 0, Number.MAX_SAFE_INTEGER);
  const adoptionCount = clampNumber(
    readNumber(statsPayload.adoptionCount ?? payload.adoptionCount ?? payload.users, 0),
    0,
    Number.MAX_SAFE_INTEGER
  );
  const likes = clampNumber(readNumber(statsPayload.likes ?? payload.likes, 0), 0, Number.MAX_SAFE_INTEGER);
  const comments = clampNumber(readNumber(statsPayload.comments ?? payload.comments, 0), 0, Number.MAX_SAFE_INTEGER);

  return {
    rating,
    users,
    successRate,
    saves,
    adoptionCount,
    likes,
    comments
  };
}

function normaliseModeratorNotes(value: unknown): CommunityModeratorNote[] {
  if (!value) {
    return [];
  }

  const candidates = Array.isArray(value) ? value : [value];
  return candidates
    .map((entry, index) => {
      if (!entry) {
        return null;
      }
      if (typeof entry === 'string') {
        const note = entry.trim();
        if (!note) {
          return null;
        }
        return {
          id: `note-${index}`,
          note,
          createdAt: new Date().toISOString()
        } satisfies CommunityModeratorNote;
      }

      if (typeof entry === 'object') {
        const source = entry as FirestoreRecord;
        const note = safeString(source.note) || safeString(source.message);
        if (!note) {
          return null;
        }
        const createdAt = readTimestamp(source.createdAt) ?? new Date();
        const author = safeString(source.author) || safeString(source.by) || undefined;
        return {
          id: safeString(source.id) || `note-${index}`,
          note,
          createdAt: createdAt.toISOString(),
          author
        } satisfies CommunityModeratorNote;
      }

      return null;
    })
    .filter((item): item is CommunityModeratorNote => Boolean(item));
}

function serialiseModeratorNotes(notes: CommunityModeratorNote[] | undefined) {
  if (!notes) {
    return [];
  }

  return notes.map((note, index) => {
    const parsedDate = note.createdAt ? readTimestamp(note.createdAt) : null;
    const timestamp =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? Timestamp.fromMillis(parsedDate.getTime())
        : serverTimestamp();
    return {
      id: note.id || createId(index),
      note: note.note,
      author: note.author ?? null,
      createdAt: timestamp
    };
  });
}

function normaliseResources(value: unknown): CommunityResource[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((entry, index) => normaliseResource(entry, index))
      .filter((item): item is CommunityResource => Boolean(item));
  }

  return [];
}

function normaliseResource(value: unknown, index: number): CommunityResource | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const source = value as FirestoreRecord;
  const id = safeString(source.id) || `resource-${index}`;
  const title = safeString(source.title) || safeString(source.name);

  if (!title) {
    return null;
  }

  return {
    id,
    title,
    description: safeString(source.description) || undefined,
    url: safeString(source.url) || undefined,
    provider: safeString(source.provider) || undefined,
    type: normaliseResourceType(source.type),
    cost: safeString(source.cost) === 'paid' ? 'paid' : 'free',
    notes: safeString(source.notes) || undefined
  };
}

function normaliseRoadmap(value: unknown): CommunityRoadmapStage[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((entry, index) => normaliseRoadmapStage(entry, index))
      .filter((item): item is CommunityRoadmapStage => Boolean(item));
  }

  return [];
}

function normaliseRoadmapStage(value: unknown, index: number): CommunityRoadmapStage | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const source = value as FirestoreRecord;
  const id = safeString(source.id) || `stage-${index}`;
  const title = safeString(source.title) || `Stage ${index + 1}`;

  const tasks = Array.isArray(source.tasks)
    ? source.tasks
        .map((task, taskIndex) => {
          if (!task || typeof task !== 'object') {
            return null;
          }
          const taskSource = task as FirestoreRecord;
          const taskTitle = safeString(taskSource.title);
          if (!taskTitle) {
            return null;
          }
          return {
            id: safeString(taskSource.id) || `${id}-task-${taskIndex}`,
            title: taskTitle,
            description: safeString(taskSource.description) || undefined,
            duration: safeString(taskSource.duration) || undefined,
            resourceIds: Array.isArray(taskSource.resourceIds)
              ? taskSource.resourceIds.filter((entry): entry is string => typeof entry === 'string')
              : undefined,
            outcome: safeString(taskSource.outcome) || undefined
          };
        })
        .filter((item): item is CommunityRoadmapStage['tasks'][number] => Boolean(item))
    : [];

  return {
    id,
    title,
    description: safeString(source.description) || undefined,
    duration: safeString(source.duration) || undefined,
    milestone: safeString(source.milestone) || undefined,
    tasks,
    resourceIds: Array.isArray(source.resourceIds)
      ? source.resourceIds.filter((entry): entry is string => typeof entry === 'string')
      : undefined,
    checkpoint: safeString(source.checkpoint) || undefined
  };
}

function normaliseStatus(value: unknown): CommunityStoryStatus {
  if (value === 'approved' || value === 'hidden') {
    return value;
  }
  return 'pending';
}

function normaliseType(value: unknown): CommunityStoryType {
  if (value === 'marketplace') {
    return 'marketplace';
  }
  return 'roadmap';
}

function normaliseDifficulty(value: unknown) {
  if (value === 'Beginner' || value === 'Advanced') {
    return value;
  }
  return 'Intermediate';
}

function normalisePrice(value: unknown): 'free' | 'premium' {
  return value === 'Premium' || value === 'premium' ? 'premium' : 'free';
}

function normaliseArray(value: unknown): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => safeString(entry))
      .filter((entry) => entry.length > 0);
  }
  if (typeof value === 'string') {
    return value
      .split(/[,;\n]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
  return [];
}

function normaliseResourceType(value: unknown): CommunityResource['type'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalised = value.trim().toLowerCase();
  switch (normalised) {
    case 'article':
      return 'article';
    case 'video':
      return 'video';
    case 'course':
      return 'course';
    case 'podcast':
      return 'podcast';
    case 'community':
      return 'community';
    case 'tool':
      return 'tool';
    case 'event':
      return 'event';
    case 'other':
      return 'other';
    default:
      return undefined;
  }
}

function ensureImage(primary: unknown, fallback: unknown, category: string) {
  const provided = safeString(primary) || safeString(fallback);
  if (provided) {
    return provided;
  }

  const key = category.trim().toLowerCase();
  if (key.includes('education')) {
    return 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg';
  }
  if (key.includes('programming') || key.includes('tech')) {
    return 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg';
  }
  if (key.includes('business')) {
    return 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg';
  }
  return 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg';
}

function safeString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  return '';
}

function readNumber(value: unknown, fallback: number): number {
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
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function readTimestamp(value: unknown): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'object' && 'toDate' in (value as { toDate?: () => Date })) {
    try {
      const cast = value as { toDate: () => Date };
      const date = cast.toDate();
      return Number.isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }
  return null;
}

function formatRelativeDate(value: Date): string {
  const now = Date.now();
  const diff = now - value.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return 'Just now';
  }
  if (diff < hour) {
    const minutes = Math.round(diff / minute);
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }
  if (diff < day) {
    const hours = Math.round(diff / hour);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  if (diff < week) {
    const days = Math.round(diff / day);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  if (diff < month) {
    const weeks = Math.round(diff / week);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  if (diff < year) {
    const months = Math.round(diff / month);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  const years = Math.round(diff / year);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function createId(seed?: number) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const random = Math.random().toString(36).slice(2, 11);
  if (typeof seed === 'number') {
    return `note-${seed}-${random}`;
  }
  return `note-${random}`;
}

function defaultStats(): CommunityStoryStats {
  return {
    rating: 4.7,
    users: 0,
    successRate: 60,
    saves: 0,
    adoptionCount: 0,
    likes: 0,
    comments: 0
  };
}
