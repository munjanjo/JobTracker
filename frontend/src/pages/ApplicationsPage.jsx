import { useCallback, useEffect, useMemo, useState } from "react";
import { applicationsApi } from "../api/applications";
import { getErrorMessages } from "../api/errors";
import { STATUSES, STATUS_DOTS, STATUS_LABELS } from "../constants/status";
import NewApplicationForm from "../components/NewApplicationForm";
import { Button, ErrorList, Spinner, StatusBadge } from "../components/ui";
import HistoryPanel from "../components/HistoryPanel";

const dateFormat = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default function ApplicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  const selected = items.find((a) => a.id === selectedId) ?? null;
  const closePanel = useCallback(() => setSelectedId(null), []);

  function handleStatusChanged(id, status) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

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

  // Filtriranje na klijentu: podaci su već učitani, pa ne treba novi zahtjev prema API-ju
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((a) => {
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      const matchesSearch =
        q === "" ||
        a.company.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [items, search, statusFilter]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
  }

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
        <div className="space-y-4 border-b border-slate-200 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold">
              Sve prijave{" "}
              <span className="font-normal text-slate-400">
                ({filtered.length}
                {filtered.length !== items.length && ` od ${items.length}`})
              </span>
            </h2>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Traži firmu ili poziciju..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-64"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={statusFilter === "All"}
              onClick={() => setStatusFilter("All")}
              label="Sve"
              count={items.length}
            />
            {STATUSES.filter((s) => counts[s] > 0).map((s) => (
              <FilterChip
                key={s}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                label={STATUS_LABELS[s]}
                count={counts[s]}
                dot={STATUS_DOTS[s]}
              />
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500">Nijedna prijava ne odgovara filterima.</p>
            <Button variant="ghost" onClick={resetFilters} className="mt-2">
              Očisti filtere
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((a) => (
              <li
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className="flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-slate-50"
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
                      onClick={(e) => e.stopPropagation()}
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

      <HistoryPanel
        application={selected}
        onClose={closePanel}
        onStatusChanged={handleStatusChanged}
      />
    </div>
  );
}

function FilterChip({ active, onClick, label, count, dot }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition ${
        active
          ? "bg-indigo-600 text-white ring-indigo-600"
          : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white" : dot}`} />}
      {label}
      <span className={active ? "text-indigo-200" : "text-slate-400"}>{count}</span>
    </button>
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
