import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/endpoints";
import type { AuthPayload, User } from "../types/models";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: AuthPayload) => Promise<string>;
  register: (payload: AuthPayload) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser() {
  const storedUser = localStorage.getItem("user");
  return storedUser ? (JSON.parse(storedUser) as User) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const saveSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login: async (payload) => {
        const response = await authApi.login(payload);
        saveSession(response.token, response.user);
        return response.redirectPath;
      },
      register: async (payload) => {
        const response = await authApi.register(payload);
        saveSession(response.token, response.user);
        return response.redirectPath;
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
