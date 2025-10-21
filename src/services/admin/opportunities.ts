import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import type { AdminOpportunity, OpportunityStatus } from '../../types/adminOpportunity';

const COLLECTION_NAME = 'opportunities';

const opportunitiesCollection = collection(db, COLLECTION_NAME);

type CreatePayload = Omit<AdminOpportunity, 'id' | 'createdAt' | 'updatedAt'>;
type UpdatePayload = Partial<CreatePayload>;

const normaliseTags = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

const normaliseStatus = (value: unknown): OpportunityStatus => {
  if (typeof value !== 'string') {
    return 'draft';
  }

  const lower = value.trim().toLowerCase();
  if (lower === 'published' || lower === 'expired') {
    return lower;
  }

  return 'draft';
};

const normaliseString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value == null) {
    return fallback;
  }
  return String(value).trim();
};

const resolveDate = (value: unknown): string | null => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return null;
};

const mapDocument = (document: unknown): AdminOpportunity => {
  const source = document as Record<string, unknown>;

  return {
    id: normaliseString(source.id),
    title: normaliseString(source.title),
    category: normaliseString(source.category),
    description: normaliseString(source.description),
    eligibility: normaliseString(source.eligibility),
    link: normaliseString(source.link),
    deadline: resolveDate(source.deadline),
    tags: normaliseTags(source.tags),
    status: normaliseStatus(source.status),
    createdAt: resolveDate(source.createdAt),
    updatedAt: resolveDate(source.updatedAt)
  };
};

export async function listOpportunities(): Promise<AdminOpportunity[]> {
  const snapshot = await getDocs(query(opportunitiesCollection));

  return snapshot.docs.map((docSnapshot) =>
    mapDocument({ id: docSnapshot.id, ...docSnapshot.data() })
  );
}

export function listenToOpportunities(
  onData: (payload: AdminOpportunity[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    opportunitiesCollection,
    (snapshot) => {
      const payload = snapshot.docs.map((docSnapshot) =>
        mapDocument({ id: docSnapshot.id, ...docSnapshot.data() })
      );
      onData(payload);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error(error);
      }
    }
  );
}

export async function createOpportunity(payload: CreatePayload) {
  const timestamp = serverTimestamp();
  await addDoc(opportunitiesCollection, {
    ...payload,
    tags: payload.tags,
    createdAt: timestamp,
    updatedAt: timestamp
  });
}

export async function updateOpportunity(id: string, payload: UpdatePayload) {
  const documentRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(documentRef, {
    ...payload,
    ...(payload.tags ? { tags: payload.tags } : {}),
    updatedAt: serverTimestamp()
  });
}

export async function deleteOpportunity(id: string) {
  const documentRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(documentRef);
}
