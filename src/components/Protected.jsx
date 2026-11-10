import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page with this to block people who are logged out or have the wrong role
export default function Protected({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="muted">Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}
