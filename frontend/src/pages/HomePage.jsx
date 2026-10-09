import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(null);

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setCount(res.data.length))
      .catch(() => setCount(null));
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div>
      <p>Ulogiran si kao: {user.email}</p>
      <p>Broj prijava: {count ?? "..."}</p>
      <button onClick={handleLogout}>Odjava</button>
    </div>
  );
}
