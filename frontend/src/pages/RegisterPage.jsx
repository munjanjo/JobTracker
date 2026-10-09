import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { authApi } from "../api/auth";
import { getErrorMessages } from "../api/errors";
import AuthLayout from "../components/AuthLayout";
import { Button, ErrorList, Input } from "../components/ui";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await authApi.register(email, password);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Napravi račun"
      subtitle="Sve prijave za posao na jednom mjestu."
      footer={
        <>
          Već imaš račun?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Prijavi se
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
          placeholder="Najmanje 6 znakova"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-slate-500">
          Lozinka mora imati veliko i malo slovo, broj i poseban znak.
        </p>
        <ErrorList errors={errors} />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Stvaram račun..." : "Registriraj se"}
        </Button>
      </form>
    </AuthLayout>
  );
}
