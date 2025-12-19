import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser, User, Permission } from "@/types";
import { getCurrentUser, login as authLogin, logout as authLogout, getRoles, getUserPermissions, initializeStorage } from "@/utils/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    if (currentUser) {
      const roles = getRoles().filter((r) => currentUser.roleIds.includes(r.id));
      const permissions = getUserPermissions(currentUser);
      setUser({
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        crm: currentUser.crm,
        roles,
        permissions,
      });
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const loggedUser = authLogin(username, password);
    if (loggedUser) {
      const roles = getRoles().filter((r) => loggedUser.roleIds.includes(r.id));
      const permissions = getUserPermissions(loggedUser);
      setUser({
        id: loggedUser.id,
        username: loggedUser.username,
        name: loggedUser.name,
        crm: loggedUser.crm,
        roles,
        permissions,
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
