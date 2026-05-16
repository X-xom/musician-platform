import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/models";

export function ProtectedRoute({ role }: { role?: Role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={
          user?.role === "CLIENT"
            ? "/client/advertisements"
            : "/musician/advertisements"
        }
        replace
      />
    );
  }

  return <Outlet />;
}
