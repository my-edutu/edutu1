import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/firebase';

interface AdminCheckState {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
}

const DEFAULT_ADMIN_EMAILS = ['admin@edutu.ai', 'founder@edutu.ai'];
const LOCAL_OVERRIDE_KEY = 'edutu.admin.override';

const hasAdminOverride = () => {
  try {
    return localStorage.getItem(LOCAL_OVERRIDE_KEY) === 'true';
  } catch {
    return false;
  }
};

const isWhitelistedAdmin = (user: User | null) => {
  if (!user?.email) {
    return false;
  }

  return DEFAULT_ADMIN_EMAILS.some(
    (email) => email.trim().toLowerCase() === user.email?.trim().toLowerCase()
  );
};

export function useAdminCheck(): AdminCheckState {
  const [state, setState] = useState<AdminCheckState>({
    isAdmin: false,
    loading: true,
    user: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const override = hasAdminOverride();
      const isAdmin = override || isWhitelistedAdmin(firebaseUser);

      setState({
        user: firebaseUser,
        loading: false,
        isAdmin
      });
    });

    return () => unsubscribe();
  }, []);

  return state;
}

export function setAdminOverride(value: boolean) {
  try {
    localStorage.setItem(LOCAL_OVERRIDE_KEY, value ? 'true' : 'false');
  } catch {
    // no-op
  }
}
