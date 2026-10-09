import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import { Spinner } from "../components/ui";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
