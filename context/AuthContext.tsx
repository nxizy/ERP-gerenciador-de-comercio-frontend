"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  ownerId: string | null;
  loading: boolean
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("ownerId");
    if (!stored) {
      router.push("/login");
    } else {
      setOwnerId(stored);
    }

    setLoading(false)
  }, []);

  function logout() {
    localStorage.removeItem("ownerId");
    setOwnerId(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ ownerId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
