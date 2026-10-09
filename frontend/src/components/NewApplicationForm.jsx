import { useState } from "react";
import { applicationsApi } from "../api/applications";
import { getErrorMessages } from "../api/errors";
import { Button, ErrorList, Input } from "./ui";

export default function NewApplicationForm({ onCreated }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setSaving(true);
    try {
      const created = await applicationsApi.create({
        company,
        position,
        url: url || null,
      });
      onCreated(created);
      setCompany("");
      setPosition("");
      setUrl("");
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-base font-semibold">Nova prijava</h2>
        <p className="text-sm text-slate-500">Dodaj oglas na koji se želiš prijaviti.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1.3fr_auto] sm:items-end">
        <Input
          label="Firma"
          placeholder="npr. Infobip"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <Input
          label="Pozicija"
          placeholder="npr. Junior .NET Developer"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <Input
          label="Link na oglas"
          type="url"
          placeholder="https://… (opcionalno)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={saving}>
          {saving ? "Spremam..." : "+ Dodaj"}
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="mt-4">
          <ErrorList errors={errors} />
        </div>
      )}
    </form>
  );
}
