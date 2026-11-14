import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "isLogged";

interface AuthContextValue {
  isLogged: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readPersistedIsLogged(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState<boolean>(readPersistedIsLogged);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isLogged));
    } catch {
      // localStorage unavailable (private mode/quota): keep in-memory state only
    }
  }, [isLogged]);

  const login = useCallback(() => setIsLogged(true), []);
  const logout = useCallback(() => setIsLogged(false), []);

  const value = useMemo(
    () => ({ isLogged, login, logout }),
    [isLogged, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
