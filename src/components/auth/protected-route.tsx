import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import type { Permission } from "@/types/domain";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user, permissions, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}
