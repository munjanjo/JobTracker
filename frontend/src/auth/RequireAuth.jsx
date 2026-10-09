import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Učitavam...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
