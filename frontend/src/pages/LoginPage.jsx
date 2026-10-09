import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Pogrešan email ili lozinka."
          : "Nešto je pošlo po zlu.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Prijava</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Prijavi se</button>
      {error && <p>{error}</p>}
      <p>
        Nemaš račun? <Link to="/register">Registriraj se</Link>
      </p>
    </form>
  );
}
