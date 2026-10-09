export const STATUSES = [
  "Saved",
  "Applied",
  "Screening",
  "TechnicalInterview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export const STATUS_LABELS = {
  Saved: "Spremljeno",
  Applied: "Prijavljeno",
  Screening: "Screening",
  TechnicalInterview: "Tehnički intervju",
  Offer: "Ponuda",
  Rejected: "Odbijeno",
  Withdrawn: "Povučeno",
};

// Badge (pozadina + tekst + obrub)
export const STATUS_COLORS = {
  Saved: "bg-slate-100 text-slate-700 ring-slate-200",
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  Screening: "bg-amber-50 text-amber-700 ring-amber-200",
  TechnicalInterview: "bg-violet-50 text-violet-700 ring-violet-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  Withdrawn: "bg-zinc-100 text-zinc-500 ring-zinc-200",
};

// Točkica uz status
export const STATUS_DOTS = {
  Saved: "bg-slate-400",
  Applied: "bg-blue-500",
  Screening: "bg-amber-500",
  TechnicalInterview: "bg-violet-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-500",
  Withdrawn: "bg-zinc-400",
};
