import { STATUS_COLORS, STATUS_DOTS, STATUS_LABELS } from "../constants/status";

export function Input({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
      <input
        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        {...props}
      />
    </label>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ErrorList({ errors }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
      <ul className="space-y-1 text-sm text-rose-700">
        {errors.map((msg) => (
          <li key={msg} className="flex gap-2">
            <span aria-hidden>•</span>
            <span>{msg}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_COLORS[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Spinner({ label = "Učitavam..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      {label}
    </div>
  );
}

export function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white shadow-sm">
        JT
      </span>
      Job Tracker
    </span>
  );
}
