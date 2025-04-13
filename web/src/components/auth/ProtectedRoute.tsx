
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/lib/auth-store";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export function ProtectedRoute({ redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}
