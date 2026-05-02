"use client";
import { useState } from "react";
import { useAdmin } from "../../lib/store";
import { Letter, ContributionStatus } from "../../lib/data";
import { Badge } from "../../components/Badge";
import { RejectModal } from "../../components/RejectModal";

function LetterCard({
  l,
  onAccept,
  onReject,
}: {
  l: Letter;
  onAccept: () => void;
  onReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        background: "#111",
        borderColor: expanded ? "#2a2a2a" : "#1e1e1e",
      }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "#10b98115", color: "#10b981" }}
          >
            {l.name.charAt(0)}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{l.name}</div>
            <div
              className="text-xs mt-0.5 flex items-center gap-1.5"
              style={{ color: "#555" }}
            >
              <span>BAC {l.bacYear}</span>
              <span style={{ color: "#333" }}>·</span>
              <span style={{ color: "#10b981" }}>{l.score}/20</span>
              <span style={{ color: "#333" }}>·</span>
              <span>{l.division}</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#3a3a3a" }}>
              📅 {l.submittedAt} &nbsp; ✉ {l.email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge status={l.status} />
          <span className="text-xs" style={{ color: "#333" }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {expanded && (
        <div
          className="border-t px-5 pb-5 pt-4 space-y-4"
          style={{ borderColor: "#1a1a1a" }}
        >
          <div className="rounded-xl p-4" style={{ background: "#0d0d0d" }}>
            <p
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: "#3a3a3a" }}
            >
              Letter Content
            </p>
            <p
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "#999" }}
            >
              {l.content}
            </p>
          </div>

          {l.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={onAccept}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: "#10b981", color: "#fff" }}
              >
                ✓ Accept & Publish
              </button>
              <button
                onClick={onReject}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "#ef444415",
                  color: "#ef4444",
                  border: "1px solid #ef444430",
                }}
              >
                ✕ Reject
              </button>
            </div>
          )}

          {l.status === "accepted" && (
            <div
              className="rounded-xl p-3.5 flex items-center gap-2.5"
              style={{ background: "#10b98108", border: "1px solid #10b98122" }}
            >
              <span className="text-lg">✅</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  Published on the homepage
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  This letter is now live and visible to BAC candidates.
                </p>
              </div>
            </div>
          )}

          {l.status === "rejected" && (
            <div
              className="rounded-xl p-3.5 space-y-2"
              style={{ background: "#ef444408", border: "1px solid #ef444420" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">❌</span>
                <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
                  Rejected — email sent to contributor
                </p>
              </div>
              {l.rejectionReason && (
                <p
                  className="text-xs leading-relaxed pl-6"
                  style={{ color: "#888" }}
                >
                  {l.rejectionReason}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TABS: ContributionStatus[] = ["pending", "accepted", "rejected"];
const TAB_COLORS: Record<ContributionStatus, string> = {
  pending: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
};

export default function LettersPage() {
  const { letters, acceptLetter, rejectLetter } = useAdmin();
  const [tab, setTab] = useState<ContributionStatus>("pending");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = letters
    .filter((l) => l.status === tab)
    .filter(
      (l) =>
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.division.toLowerCase().includes(search.toLowerCase()),
    );

  const counts = TABS.reduce(
    (acc, t) => {
      acc[t] = letters.filter((l) => l.status === t).length;
      return acc;
    },
    {} as Record<ContributionStatus, number>,
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {rejectTarget && (
        <RejectModal
          type="letter"
          onConfirm={(reason) => {
            rejectLetter(rejectTarget, reason);
            setRejectTarget(null);
          }}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">Letters Management</h1>
        <p className="text-sm mt-1" style={{ color: "#555" }}>
          Review and publish contributor experience letters shown on the
          homepage
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: tab === t ? TAB_COLORS[t] + "18" : "#111",
                color: tab === t ? TAB_COLORS[t] : "#555",
                border: `1px solid ${tab === t ? TAB_COLORS[t] + "40" : "#1e1e1e"}`,
              }}
            >
              <span className="capitalize">{t}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                style={{
                  background: TAB_COLORS[t] + "25",
                  color: TAB_COLORS[t],
                }}
              >
                {counts[t]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "#444" }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, division..."
            className="w-full pl-8 pr-4 py-2 rounded-xl text-sm text-white outline-none"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#333" }}>
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">No {tab} letters</p>
          </div>
        ) : (
          filtered.map((l) => (
            <LetterCard
              key={l.id}
              l={l}
              onAccept={() => acceptLetter(l.id)}
              onReject={() => setRejectTarget(l.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
