import { ContributionStatus } from "@/lib/data";

const CONFIG = {
  pending: {
    bg: "#f59e0b15",
    text: "#f59e0b",
    dot: "#f59e0b",
    label: "Pending",
  },
  accepted: {
    bg: "#10b98115",
    text: "#10b981",
    dot: "#10b981",
    label: "Accepted",
  },
  rejected: {
    bg: "#ef444415",
    text: "#ef4444",
    dot: "#ef4444",
    label: "Rejected",
  },
};

export function Badge({ status }: { status: ContributionStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: c.dot }}
      />
      {c.label}
    </span>
  );
}
