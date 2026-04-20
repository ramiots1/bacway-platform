"use client";
import { useState } from "react";
import { useAdmin } from "../../lib/store";
import { Contribution, ContributionStatus } from "../../lib/data";
import { Badge } from "../../components/Badge";
import { RejectModal } from "../../components/RejectModal";

function ContributionCard({
  c,
  onAccept,
  onReject,
}: {
  c: Contribution;
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
      {/* Row */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: "#00c8ff15", color: "#00c8ff" }}
          >
            {c.name.charAt(0)}
          </div>
          <div>
            <div className="text-white font-medium text-sm">{c.name}</div>
            <div
              className="text-xs mt-0.5 flex items-center gap-1.5 flex-wrap"
              style={{ color: "#555" }}
            >
              <span>BAC {c.bacYear}</span>
              <span style={{ color: "#333" }}>·</span>
              <span style={{ color: "#00c8ff" }}>{c.score}/20</span>
              <span style={{ color: "#333" }}>·</span>
              <span>{c.division}</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#3a3a3a" }}>
              📅 {c.submittedAt} &nbsp; ✉ {c.email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge status={c.status} />
          <span className="text-xs" style={{ color: "#333" }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          className="border-t px-5 pb-5 pt-4 space-y-4"
          style={{ borderColor: "#1a1a1a" }}
        >
          {/* Description + link */}
          <div
            className="rounded-xl p-4 space-y-3"
            style={{ background: "#0d0d0d" }}
          >
            <div>
              <p
                className="text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "#3a3a3a" }}
              >
                Description
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#999" }}>
                {c.description}
              </p>
            </div>
            <div>
              <p
                className="text-xs font-medium uppercase tracking-widest mb-1.5"
                style={{ color: "#3a3a3a" }}
              >
                Google Drive Link
              </p>
              <a
                href={c.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm break-all inline-flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ color: "#00c8ff" }}
              >
                {c.driveLink} ↗
              </a>
            </div>
          </div>

          {/* Actions */}
          {c.status === "pending" && (
            <div className="flex gap-3">
              <button
                onClick={onAccept}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                style={{ background: "#10b981", color: "#fff" }}
              >
                ✓ Accept & Archive
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

          {c.status === "accepted" && (
            <div
              className="rounded-xl p-3.5 flex items-center gap-2.5"
              style={{ background: "#10b98108", border: "1px solid #10b98122" }}
            >
              <span className="text-lg">✅</span>
              <div>
                <p className="text-sm font-medium" style={{ color: "#10b981" }}>
                  Accepted & archived
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  This resource is now live in the BACWAY Library.
                </p>
              </div>
            </div>
          )}

          {c.status === "rejected" && (
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
              {c.rejectionReason && (
                <p
                  className="text-xs leading-relaxed pl-6"
                  style={{ color: "#888" }}
                >
                  {c.rejectionReason}
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

export default function ContributionsPage() {
  const { contributions, acceptContribution, rejectContribution } = useAdmin();
  const [tab, setTab] = useState<ContributionStatus>("pending");
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = contributions
    .filter((c) => c.status === tab)
    .filter(
      (c) =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.division.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()),
    );

  const counts = TABS.reduce(
    (acc, t) => {
      acc[t] = contributions.filter((c) => c.status === t).length;
      return acc;
    },
    {} as Record<ContributionStatus, number>,
  );

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {rejectTarget && (
        <RejectModal
          type="contribution"
          onConfirm={(reason) => {
            rejectContribution(rejectTarget, reason);
            setRejectTarget(null);
          }}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">
          Contributions Management
        </h1>
        <p className="text-sm mt-1" style={{ color: "#555" }}>
          Review, accept, or reject contributor file submissions
        </p>
      </div>

      {/* Tabs + Search */}
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
            placeholder="Search name, division, email..."
            className="w-full pl-8 pr-4 py-2 rounded-xl text-sm text-white outline-none"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#333" }}>
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm">
              No {tab} contributions{search ? " matching your search" : ""}
            </p>
          </div>
        ) : (
          filtered.map((c) => (
            <ContributionCard
              key={c.id}
              c={c}
              onAccept={() => acceptContribution(c.id)}
              onReject={() => setRejectTarget(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
