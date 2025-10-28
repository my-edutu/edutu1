import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const ensureDb = () => {
  if (!db) {
    throw new Error('Firestore is not initialised. Verify Firebase configuration.');
  }
  return db;
};

export interface SupportTicketInput {
  userId: string;
  subject: string;
  message: string;
  userEmail?: string;
  category?: string;
  priority?: 'low' | 'normal' | 'high';
  metadata?: Record<string, unknown>;
}

export interface SupportTicketReplyInput {
  ticketId: string;
  message: string;
  sender: 'user' | 'admin';
}

export async function createSupportTicket(payload: SupportTicketInput) {
  const database = ensureDb();
  const subject = payload.subject.trim();
  const message = payload.message.trim();

  if (!subject) {
    throw new Error('Subject is required.');
  }

  if (!message) {
    throw new Error('Message cannot be empty.');
  }

  const ticketRef = await addDoc(collection(database, 'support_tickets'), {
    userId: payload.userId,
    userEmail: payload.userEmail ?? null,
    subject,
    category: payload.category?.trim() || 'General',
    status: 'open',
    priority: payload.priority ?? 'normal',
    source: 'app',
    metadata: payload.metadata ?? {},
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });

  await addDoc(collection(database, 'support_tickets', ticketRef.id, 'messages'), {
    sender: 'user',
    text: message,
    timestamp: serverTimestamp()
  });

  return ticketRef.id;
}

export async function appendSupportTicketMessage(payload: SupportTicketReplyInput) {
  const database = ensureDb();
  const trimmed = payload.message.trim();
  if (!trimmed) {
    throw new Error('Message cannot be empty.');
  }

  await addDoc(collection(database, 'support_tickets', payload.ticketId, 'messages'), {
    sender: payload.sender,
    text: trimmed,
    timestamp: serverTimestamp()
  });

  await updateDoc(doc(database, 'support_tickets', payload.ticketId), {
    lastUpdated: serverTimestamp()
  });
}
