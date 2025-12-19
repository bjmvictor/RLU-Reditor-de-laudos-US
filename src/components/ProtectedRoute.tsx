import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Permission } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: Permission;
}

export default function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return null; // Será redirecionado pelo App.tsx
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h1>
          <p className="text-gray-600 dark:text-gray-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
