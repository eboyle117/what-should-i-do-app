"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { SessionProvider } from "next-auth/react"; // ✅ ADD THIS

type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

const AuthContext = createContext<{
  session: Session;
  isLoading: boolean;
  refetch: () => Promise<void>;
}>({
  session: null,
  isLoading: true,
  refetch: async () => {},
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data?.user ? { user: data.user } : null);
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <SessionProvider> {/* ✅ THIS FIXES EVERYTHING */}
      <AuthContext.Provider value={{ session, isLoading, refetch }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}