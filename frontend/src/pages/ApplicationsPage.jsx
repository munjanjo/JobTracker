import { useEffect, useMemo, useState } from "react";
import { applicationsApi } from "../api/applications";
import { getErrorMessages } from "../api/errors";
import { STATUSES, STATUS_DOTS, STATUS_LABELS } from "../constants/status";
import NewApplicationForm from "../components/NewApplicationForm";
import { ErrorList, Spinner, StatusBadge } from "../components/ui";

const dateFormat = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ApplicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    applicationsApi
      .getAll()
      .then(setItems)
      .catch((err) => setError(getErrorMessages(err)[0]))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(created) {
    setItems((prev) => [created, ...prev]);
  }

  // Broj prijava po statusu, za kartice sa statistikom
  const counts = useMemo(() => {
    const result = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    for (const a of items) result[a.status] += 1;
    return result;
  }, [items]);

  if (loading) return <Spinner label="Učitavam prijave..." />;
  if (error) return <ErrorList errors={[error]} />;

  const active = items.length - counts.Rejected - counts.Withdrawn;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Moje prijave</h1>
        <p className="mt-1 text-sm text-slate-500">
          Prati gdje si se prijavio i u kojoj si fazi.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Ukupno" value={items.length} />
        <StatCard label="Aktivne" value={active} />
        <StatCard label="Intervjui" value={counts.Screening + counts.TechnicalInterview} />
        <StatCard label="Ponude" value={counts.Offer} accent />
      </div>

      <NewApplicationForm onCreated={handleCreated} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold">Sve prijave</h2>
          <div className="hidden flex-wrap gap-3 md:flex">
            {STATUSES.filter((s) => counts[s] > 0).map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOTS[s]}`} />
                {STATUS_LABELS[s]} {counts[s]}
              </span>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                  {a.company[0]?.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.company}</p>
                  <p className="truncate text-sm text-slate-500">{a.position}</p>
                </div>
                <div className="hidden text-right text-sm text-slate-500 sm:block">
                  {dateFormat.format(new Date(a.createdAt))}
                  {a.url && (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Oglas ↗
                    </a>
                  )}
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        accent ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className={`text-sm ${accent ? "text-emerald-700" : "text-slate-500"}`}>{label}</p>
      <p className={`mt-1 text-3xl font-semibold tracking-tight ${accent ? "text-emerald-700" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
        📋
      </div>
      <h3 className="mt-4 font-medium">Još nemaš prijava</h3>
      <p className="mt-1 text-sm text-slate-500">
        Dodaj prvi oglas u formi iznad i kreni pratiti napredak.
      </p>
    </div>
  );
}
