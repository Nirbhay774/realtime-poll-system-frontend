"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { clearStoredAuthSession, readStoredAuthSession, writeStoredAuthSession } from "@/lib/auth-storage";
import type { AuthSession, LoginPayload, RegisterPayload } from "@/lib/types";
import { loginUser, registerUser } from "@/services/auth";

type AuthContextValue = {
  session: AuthSession | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  register: (payload: RegisterPayload) => Promise<AuthSession>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setSession(readStoredAuthSession());
      setIsLoading(false);
    });
  }, []);

  const persistSession = (nextSession: AuthSession) => {
    writeStoredAuthSession(nextSession);
    setSession(nextSession);
    return nextSession;
  };

  const logout = () => {
    clearStoredAuthSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        login: async (payload) => persistSession(await loginUser(payload)),
        register: async (payload) => persistSession(await registerUser(payload)),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
