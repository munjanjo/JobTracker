import { useCallback, useEffect, useState } from "react";
import { applicationsApi } from "../api/applications";
import { getErrorMessages } from "../api/errors";
import { STATUSES, STATUS_DOTS, STATUS_LABELS } from "../constants/status";
import { ErrorList, Spinner } from "../components/ui";
import HistoryPanel from "../components/HistoryPanel";

const dateFormat = new Intl.DateTimeFormat("hr-HR", {
  day: "numeric",
  month: "short",
});

export default function BoardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [moveError, setMoveError] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [overStatus, setOverStatus] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Izvodimo odabranu prijavu iz items, pa panel uvijek vidi svježi status
  const selected = items.find((a) => a.id === selectedId) ?? null;
  const closePanel = useCallback(() => setSelectedId(null), []);

  function handleStatusChanged(id, status) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  useEffect(() => {
    applicationsApi
      .getAll()
      .then(setItems)
      .catch((err) => setLoadError(getErrorMessages(err)[0]))
      .finally(() => setLoading(false));
  }, []);

  // Optimistični update: kartica se odmah pomakne, a ako backend odbije, vraćamo je natrag.
  async function moveTo(id, newStatus) {
    const application = items.find((a) => a.id === id);
    if (!application || application.status === newStatus) return;

    const previousStatus = application.status;
    setMoveError(null);
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    );

    try {
      await applicationsApi.changeStatus(id, newStatus, null);
    } catch (err) {
      setItems((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: previousStatus } : a)),
      );
      setMoveError(
        `Nije uspjelo premjestiti "${application.company}": ${getErrorMessages(err)[0]}`,
      );
    }
  }

  function handleDrop(e, status) {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain")) || draggedId;
    setOverStatus(null);
    setDraggedId(null);
    if (id) moveTo(id, status);
  }

  if (loading) return <Spinner label="Učitavam ploču..." />;
  if (loadError) return <ErrorList errors={[loadError]} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kanban</h1>
          <p className="mt-1 text-sm text-slate-500">
            Povuci karticu u drugi stupac da promijeniš status prijave.
          </p>
        </div>
        <p className="text-sm text-slate-500">{items.length} prijava</p>
      </div>

      {moveError && <ErrorList errors={[moveError]} />}

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="flex min-w-max gap-4">
          {STATUSES.map((status) => {
            const columnItems = items.filter((a) => a.status === status);
            const isOver = overStatus === status;

            return (
              <section
                key={status}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (overStatus !== status) setOverStatus(status);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget))
                    setOverStatus(null);
                }}
                onDrop={(e) => handleDrop(e, status)}
                className={`flex w-72 flex-col rounded-2xl border p-3 transition ${
                  isOver
                    ? "border-indigo-300 bg-indigo-50/70 ring-2 ring-indigo-200"
                    : "border-slate-200 bg-slate-100/60"
                }`}
              >
                <header className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${STATUS_DOTS[status]}`}
                    />
                    <h2 className="text-sm font-semibold text-slate-700">
                      {STATUS_LABELS[status]}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm">
                    {columnItems.length}
                  </span>
                </header>

                <div className="flex min-h-24 flex-1 flex-col gap-2">
                  {columnItems.map((a) => (
                    <article
                      key={a.id}
                      draggable
                      onDragStart={(e) => {
                        setDraggedId(a.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(a.id));
                      }}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setOverStatus(null);
                      }}
                      onClick={() => setSelectedId(a.id)}
                      className={`cursor-grab rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${
                        draggedId === a.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                          {a.company[0]?.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {a.company}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {a.position}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>{dateFormat.format(new Date(a.createdAt))}</span>
                        {a.url && (
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            draggable={false}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Oglas ↗
                          </a>
                        )}
                      </div>
                    </article>
                  ))}

                  {columnItems.length === 0 && (
                    <div
                      className={`flex flex-1 items-center justify-center rounded-xl border-2 border-dashed text-xs ${
                        isOver
                          ? "border-indigo-300 text-indigo-500"
                          : "border-slate-200 text-slate-400"
                      }`}
                    >
                      Spusti ovdje
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <HistoryPanel
        application={selected}
        onClose={closePanel}
        onStatusChanged={handleStatusChanged}
      />
    </div>
  );
}
