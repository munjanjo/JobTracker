import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { Button, ErrorList, Input } from "../components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Pogrešan email ili lozinka."
          : "Nešto je pošlo po zlu.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Dobrodošao natrag"
      subtitle="Prijavi se i nastavi pratiti svoje prijave."
      footer={
        <>
          Nemaš račun?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Registriraj se
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="ime@primjer.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Lozinka"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ErrorList errors={error ? [error] : []} />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Prijavljujem..." : "Prijavi se"}
        </Button>
      </form>
    </AuthLayout>
  );
}
