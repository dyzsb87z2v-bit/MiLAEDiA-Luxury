import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type AdminSession = {
  email: string;
  role: string;
} | null;

type AdminAuthContextType = {
  session: AdminSession;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/session', { credentials: 'include' })
      .then(async (response) => {
        if (!active) return;
        if (!response.ok) {
          setSession(null);
          return;
        }
        const data = await response.json() as {
          authenticated: boolean;
          user?: { email: string; role: string };
        };
        setSession(data.authenticated && data.user ? data.user : null);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({})) as {
        authenticated?: boolean;
        user?: { email: string; role: string };
        message?: string;
      };
      if (!response.ok || !data.authenticated || !data.user) {
        setSession(null);
        return { ok: false, message: data.message || 'Gallery access could not be verified.' };
      }
      setSession(data.user);
      return { ok: true };
    } catch {
      setSession(null);
      return { ok: false, message: 'The authentication service is unavailable.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setSession(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}