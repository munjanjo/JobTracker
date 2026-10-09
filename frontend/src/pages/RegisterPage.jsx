import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { authApi } from "../api/auth";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    try {
      await authApi.register(email, password);
      await login(email, password);
      navigate("/");
    } catch (err) {
      const messages = Object.values(err.response?.data?.errors ?? {}).flat();
      setErrors(messages.length ? messages : ["Nešto je pošlo po zlu."]);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registracija</h1>
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
      <button type="submit">Registriraj se</button>
      {errors.length > 0 && (
        <ul>
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
      <p>
        Već imaš račun? <Link to="/login">Prijavi se</Link>
      </p>
    </form>
  );
}
