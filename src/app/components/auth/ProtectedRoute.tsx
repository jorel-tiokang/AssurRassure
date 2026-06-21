import { Navigate, Outlet } from 'react-router';
import { useAuthStore, UserRole } from '../../lib/authStore';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Logged in but not the right role, redirect to their respective dashboard
    if (user.role === 'AGENT') {
      return <Navigate to="/agent/dashboard" replace />;
    } else if (user.role === 'MEDECIN') {
      return <Navigate to="/medecin/dashboard" replace />;
    }
    // Fallback
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
