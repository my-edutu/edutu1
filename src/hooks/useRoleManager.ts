import { useCallback, useMemo, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type UserRole = 'admin' | 'moderator' | 'learner';

const ROLE_FALLBACK: UserRole = 'learner';
const VALID_ROLES: readonly UserRole[] = ['admin', 'moderator', 'learner'] as const;

const normaliseRole = (value: unknown): UserRole => {
  if (typeof value !== 'string') {
    return ROLE_FALLBACK;
  }

  const lowerValue = value.trim().toLowerCase();
  return (VALID_ROLES.find((role) => role === lowerValue) ?? ROLE_FALLBACK) as UserRole;
};

interface RoleManagerState {
  loading: boolean;
  error: string | null;
  message: string | null;
  activeUserId: string | null;
}

interface UseRoleManagerReturn extends RoleManagerState {
  getUserRole: (uid: string) => Promise<UserRole>;
  setUserRole: (uid: string, role: UserRole) => Promise<UserRole>;
  resetFeedback: () => void;
  roles: readonly UserRole[];
}

export function useRoleManager(): UseRoleManagerReturn {
  const [state, setState] = useState<RoleManagerState>({
    loading: false,
    error: null,
    message: null,
    activeUserId: null
  });

  const ensureDb = useCallback(() => {
    if (!db) {
      throw new Error('Firestore is not initialised. Check Firebase configuration.');
    }
    return db;
  }, []);

  const getUserRole = useCallback(
    async (uid: string) => {
      try {
        const database = ensureDb();
        const userDoc = doc(database, 'users', uid);
        const snapshot = await getDoc(userDoc);
        if (!snapshot.exists()) {
          throw new Error('User record was not found.');
        }

        const data = snapshot.data() as Record<string, unknown>;
        return normaliseRole(data.role);
      } catch (error) {
        console.error('Failed to fetch user role', error);
        throw error instanceof Error ? error : new Error('Unable to fetch user role.');
      }
    },
    [ensureDb]
  );

  const setUserRole = useCallback(
    async (uid: string, role: UserRole) => {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
        message: null,
        activeUserId: uid
      }));

      try {
        const database = ensureDb();
        const userDoc = doc(database, 'users', uid);
        await setDoc(
          userDoc,
          {
            role,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );

        setState({
          loading: false,
          error: null,
          message: `Role updated to ${role}.`,
          activeUserId: null
        });
        return role;
      } catch (error) {
        console.error('Failed to update user role', error);
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Unable to update user role.',
          message: null,
          activeUserId: null
        });
        throw error instanceof Error ? error : new Error('Unable to update user role.');
      }
    },
    [ensureDb]
  );

  const resetFeedback = useCallback(() => {
    setState((previous) => ({
      ...previous,
      error: null,
      message: null
    }));
  }, []);

  const roles = useMemo(() => VALID_ROLES, []);

  return {
    ...state,
    getUserRole,
    setUserRole,
    resetFeedback,
    roles
  };
}

export default useRoleManager;
