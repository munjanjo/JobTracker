import { useEffect, useState } from "react";
import { applicationsApi } from "../api/applications";
import { getErrorMessages } from "../api/errors";
import { STATUSES, STATUS_DOTS, STATUS_LABELS } from "../constants/status";
import { Button, ErrorList, Spinner, StatusBadge } from "./ui";

const dateTimeFormat = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// Bočni panel (drawer): povijest statusa jedne prijave + promjena statusa s bilješkom.
// application === null → panel je zatvoren.
export default function HistoryPanel({
  application,
  onClose,
  onStatusChanged,
  onDelete,
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErrors, setSaveErrors] = useState([]);

  const id = application?.id;

  // Učitaj povijest kad se otvori panel za drugu prijavu (ili nakon spremanja).
  useEffect(() => {
    if (id == null) return;
    let ignore = false; // štiti od "race conditiona" kad brzo klikaš po karticama
    setLoading(true);
    setError(null);
    applicationsApi
      .getHistory(id)
      .then((data) => {
        if (!ignore) setHistory(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessages(err)[0]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  // Resetiraj formu kad se promijeni prijava
  useEffect(() => {
    setNewStatus("");
    setNotes("");
    setSaveErrors([]);
  }, [id]);

  // Escape zatvara panel
  useEffect(() => {
    if (id == null) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, onClose]);

  if (!application) return null;
  async function handleDelete() {
    if (!window.confirm("Obrisati ovu prijavu?")) return;
    try {
      await applicationsApi.delete(id);
      onDelete?.(id);
      onClose();
    } catch (err) {
      setSaveErrors(getErrorMessages(err));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!newStatus) return;
    setSaving(true);
    setSaveErrors([]);
    try {
      await applicationsApi.changeStatus(id, newStatus, notes.trim() || null);
      onStatusChanged?.(id, newStatus);
      setNewStatus("");
      setNotes("");
      setReloadKey((k) => k + 1); // ponovno učitaj povijest
    } catch (err) {
      setSaveErrors(getErrorMessages(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Zatamnjena pozadina, klik zatvara panel */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">
              {application.company}
            </p>
            <p className="truncate text-sm text-slate-500">
              {application.position}
            </p>
            <div className="mt-3">
              <StatusBadge status={application.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zatvori"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-sm font-semibold text-slate-700">
              Promijeni status
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Odaberi novi status...</option>
              {STATUSES.filter((s) => s !== application.status).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Bilješka (opcionalno), npr. 'Zvao HR, intervju u utorak'"
              className="block w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <ErrorList errors={saveErrors} />
            <Button
              type="submit"
              disabled={!newStatus || saving}
              className="w-full"
            >
              {saving ? "Spremam..." : "Spremi promjenu"}
            </Button>
          </form>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="mt-3 w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            Obriši prijavu
          </Button>

          <h3 className="mb-4 mt-8 text-sm font-semibold text-slate-700">
            Povijest statusa
          </h3>

          {loading && <Spinner label="Učitavam povijest..." />}
          {error && <ErrorList errors={[error]} />}

          {!loading && !error && (
            <ol className="relative ml-1.5 border-l-2 border-slate-200">
              {history.map((h) => (
                <li key={h.id} className="relative pb-6 pl-6 last:pb-0">
                  <span
                    className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${STATUS_DOTS[h.toStatus]}`}
                  />
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {h.fromStatus ? (
                      <>
                        <span className="text-slate-500">
                          {STATUS_LABELS[h.fromStatus]}
                        </span>

                        <span className="text-slate-400">→</span>
                      </>
                    ) : (
                      <span className="text-slate-500">Kreirano kao</span>
                    )}
                    <span className="font-medium">
                      {STATUS_LABELS[h.toStatus]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {dateTimeFormat.format(new Date(h.changedAt))}
                  </p>
                  {h.notes && (
                    <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      {h.notes}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>
    </div>
  );
}
