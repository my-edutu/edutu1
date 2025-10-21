import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type SupportTicketStatus = 'open' | 'resolved';

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: Date | null;
}

export interface SupportTicketRecord {
  id: string;
  userId: string;
  userEmail?: string;
  subject: string;
  status: SupportTicketStatus;
  lastUpdated: Date | null;
}

interface SupportTicketsState {
  tickets: SupportTicketRecord[];
  loading: boolean;
  error: string | null;
}

const ensureDb = () => {
  if (!db) {
    throw new Error('Firestore is not initialised. Check Firebase configuration.');
  }
  return db;
};

const mapTicket = (snapshot: DocumentData): SupportTicketRecord => {
  const data = snapshot.data() as Record<string, unknown>;
  const lastUpdatedValue = data.lastUpdated;
  let lastUpdated: Date | null = null;

  if (lastUpdatedValue instanceof Date) {
    lastUpdated = lastUpdatedValue;
  } else if (lastUpdatedValue && typeof lastUpdatedValue === 'object' && 'toDate' in lastUpdatedValue) {
    lastUpdated = (lastUpdatedValue as { toDate: () => Date }).toDate();
  } else if (typeof lastUpdatedValue === 'string' || typeof lastUpdatedValue === 'number') {
    const parsed = new Date(lastUpdatedValue);
    lastUpdated = Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const status = data.status === 'resolved' ? 'resolved' : 'open';

  return {
    id: snapshot.id,
    userId: typeof data.userId === 'string' ? data.userId : 'unknown-user',
    userEmail: typeof data.userEmail === 'string' ? data.userEmail : undefined,
    subject: typeof data.subject === 'string' ? data.subject : 'General inquiry',
    status,
    lastUpdated
  };
};

export function useSupportTickets() {
  const [state, setState] = useState<SupportTicketsState>({
    tickets: [],
    loading: true,
    error: null
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    try {
      const database = ensureDb();
      const ticketsQuery = query(collection(database, 'support_tickets'), orderBy('lastUpdated', 'desc'));
      const unsubscribe = onSnapshot(
        ticketsQuery,
        (snapshot) => {
          const tickets = snapshot.docs.map((docSnapshot) => mapTicket(docSnapshot));
          setState({
            tickets,
            loading: false,
            error: null
          });
        },
        (error) => {
          console.error('Support tickets stream failed', error);
          setState((previous) => ({
            ...previous,
            loading: false,
            error: 'Unable to load support tickets. Please refresh.'
          }));
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to initialise support tickets listener', error);
      setState({
        tickets: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to load support tickets.'
      });
      return undefined;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const database = ensureDb();
      setState((previous) => ({ ...previous, loading: true }));
      const snapshot = await getDocs(query(collection(database, 'support_tickets'), orderBy('lastUpdated', 'desc')));
      const tickets = snapshot.docs.map((docSnapshot) => mapTicket(docSnapshot));
      setState({
        tickets,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to refresh support tickets', error);
      setState((previous) => ({
        ...previous,
        loading: false,
        error: error instanceof Error ? error.message : 'Unable to refresh support tickets.'
      }));
    }
  }, []);

  const getMessages = useCallback(async (ticketId: string): Promise<SupportTicketMessage[]> => {
    try {
      const database = ensureDb();
      const messagesQuery = query(
        collection(database, 'support_tickets', ticketId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const snapshot = await getDocs(messagesQuery);
      return snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data() as Record<string, unknown>;
        let timestamp: Date | null = null;
        const rawTimestamp = data.timestamp;
        if (rawTimestamp instanceof Date) {
          timestamp = rawTimestamp;
        } else if (rawTimestamp && typeof rawTimestamp === 'object' && 'toDate' in rawTimestamp) {
          timestamp = (rawTimestamp as { toDate: () => Date }).toDate();
        } else if (typeof rawTimestamp === 'string' || typeof rawTimestamp === 'number') {
          const parsed = new Date(rawTimestamp);
          timestamp = Number.isNaN(parsed.getTime()) ? null : parsed;
        }

        return {
          id: docSnapshot.id,
          sender: data.sender === 'admin' ? 'admin' : 'user',
          text: typeof data.text === 'string' ? data.text : '',
          timestamp
        };
      });
    } catch (error) {
      console.error('Failed to load support ticket messages', error);
      throw error instanceof Error ? error : new Error('Unable to load ticket messages.');
    }
  }, []);

  const sendReply = useCallback(async (ticketId: string, message: string) => {
    if (!message.trim()) {
      throw new Error('Message cannot be empty.');
    }

    try {
      const database = ensureDb();
      setActionLoading(true);
      await addDoc(collection(database, 'support_tickets', ticketId, 'messages'), {
        sender: 'admin',
        text: message.trim(),
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(database, 'support_tickets', ticketId), {
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to send support ticket reply', error);
      throw error instanceof Error ? error : new Error('Unable to send reply.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const setStatus = useCallback(async (ticketId: string, status: SupportTicketStatus) => {
    try {
      const database = ensureDb();
      setActionLoading(true);
      await setDoc(
        doc(database, 'support_tickets', ticketId),
        {
          status,
          lastUpdated: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to update support ticket status', error);
      throw error instanceof Error ? error : new Error('Unable to update ticket status.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const openTickets = useMemo(
    () => state.tickets.filter((ticket) => ticket.status === 'open').length,
    [state.tickets]
  );

  return {
    tickets: state.tickets,
    loading: state.loading,
    error: state.error,
    refresh,
    getMessages,
    sendReply,
    setStatus,
    actionLoading,
    openTickets
  };
}

export default useSupportTickets;
