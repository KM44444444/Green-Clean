import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  StoredUser,
  Role,
  seedIfNeeded,
  getCurrentUser,
  login as storeLogin,
  logout as storeLogout,
  signup as storeSignup,
} from "@/lib/store";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export { API_BASE };

interface UserContextType {
  currentUser: StoredUser | null;
  role: Role | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => { ok: true; token: string; user: StoredUser } | { ok: false; error: string };
  signup: (input: { name: string; email: string; password: string; role: Role; state: string; city: string }) =>
    | { ok: true; token: string; user: StoredUser }
    | { ok: false; error: string };
  logout: () => void;
  refresh: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  useEffect(() => {
    seedIfNeeded();
    const storedToken = localStorage.getItem("gc_token");
    const storedUser = getCurrentUser();
    if (storedToken) setToken(storedToken);
    if (storedUser) setCurrentUser(storedUser);
    setLoading(false);
  }, [refresh]);

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/api${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });
    return await res.json();
  };

  const login: UserContextType["login"] = async (email, password) => {
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!result.ok) return result;
    setCurrentUser(result.user);
    setToken(result.token);
    localStorage.setItem("gc_token", result.token);
    return { ok: true, token: result.token, user: result.user };
  };

  const signup: UserContextType["signup"] = async (input) => {
    const result = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (!result.ok) return result;
    setCurrentUser(result.user);
    setToken(result.token);
    localStorage.setItem("gc_token", result.token);
    return { ok: true, token: result.token, user: result.user };
  };

  const logout = () => {
    storeLogout();
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("gc_token");
  };

  return (
    <UserContext.Provider
      value={{ currentUser, role: currentUser?.role ?? null, token, loading, login, signup, logout, refresh }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
