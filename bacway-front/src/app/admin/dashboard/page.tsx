"use client";

import { useAdmin } from "../lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: `${color}08`, borderLeft: `3px solid ${color}` }}
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-xs" style={{ color: "#666" }}>
          {label}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  type: "contribution" | "letter";
  title: string;
  subtitle: string;
  status: string;
  onClick: () => void;
}

function ActivityItem({
  type,
  title,
  subtitle,
  status,
  onClick,
}: ActivityItemProps) {
  const statusColors = {
    pending: { bg: "#f59e0b15", text: "#f59e0b" },
    accepted: { bg: "#10b98115", text: "#10b981" },
    rejected: { bg: "#ef444415", text: "#ef4444" },
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all hover:scale-102"
      style={{
        background: "#161616",
        borderLeft: `3px solid ${type === "contribution" ? "#00c8ff" : "#8b5cf6"}`,
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl">{type === "contribution" ? "📁" : "✉"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <p className="text-xs" style={{ color: "#666" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <span
        className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ml-2"
        style={{
          background: statusColors[status as keyof typeof statusColors]?.bg,
          color: statusColors[status as keyof typeof statusColors]?.text,
        }}
      >
        {status}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const { contributions, letters } = useAdmin();
  const router = useRouter();

  const stats = {
    pendingContributions: contributions.filter((c) => c.status === "pending")
      .length,
    acceptedContributions: contributions.filter((c) => c.status === "accepted")
      .length,
    rejectedContributions: contributions.filter((c) => c.status === "rejected")
      .length,
    totalContributions: contributions.length,

    pendingLetters: letters.filter((l) => l.status === "pending").length,
    acceptedLetters: letters.filter((l) => l.status === "accepted").length,
    rejectedLetters: letters.filter((l) => l.status === "rejected").length,
    totalLetters: letters.length,
  };

  const recentContributions = contributions.slice(-5).reverse();
  const recentLetters = letters.slice(-5).reverse();

  return (
    <div className="p-6 space-y-6 pb-12" style={{ background: "#0a0a0a" }}>
      {/* Welcome Section */}
      <div
        style={{
          background: "#161616",
          borderRadius: "1.5rem",
          border: "1px solid #1a1a1a",
        }}
        className="p-6"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to BACWAY Admin
        </h1>
        <p style={{ color: "#888" }}>
          Manage contributions, letters, and platform content from here. You
          have {stats.pendingContributions + stats.pendingLetters} items pending
          review.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Contributions"
          value={stats.totalContributions}
          icon="📁"
          color="#00c8ff"
        />
        <StatCard
          label="Pending Contributions"
          value={stats.pendingContributions}
          icon="⏳"
          color="#f59e0b"
        />
        <StatCard
          label="Total Letters"
          value={stats.totalLetters}
          icon="✉"
          color="#8b5cf6"
        />
        <StatCard
          label="Pending Letters"
          value={stats.pendingLetters}
          icon="⏳"
          color="#f59e0b"
        />
      </div>

      {/* Two Column Layout for Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contributions */}
        <div
          style={{
            background: "#161616",
            borderRadius: "1.5rem",
            border: "1px solid #1a1a1a",
          }}
          className="p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Contributions
              </h2>
              <p className="text-xs mt-1" style={{ color: "#666" }}>
                Latest submissions
              </p>
            </div>
            <Link
              href="/admin/dashboard/contributions"
              className="text-xs px-3 py-1 rounded-lg transition-colors"
              style={{ background: "#00c8ff15", color: "#00c8ff" }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentContributions.length > 0 ? (
              recentContributions.map((c) => (
                <ActivityItem
                  key={c.id}
                  type="contribution"
                  title={c.name}
                  subtitle={`${c.division} • ${c.bacYear}`}
                  status={c.status}
                  onClick={() => router.push("/admin/dashboard/contributions")}
                />
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: "#666" }}>
                No contributions yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Letters */}
        <div
          style={{
            background: "#161616",
            borderRadius: "1.5rem",
            border: "1px solid #1a1a1a",
          }}
          className="p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent Letters
              </h2>
              <p className="text-xs mt-1" style={{ color: "#666" }}>
                Latest submissions
              </p>
            </div>
            <Link
              href="/admin/dashboard/letters"
              className="text-xs px-3 py-1 rounded-lg transition-colors"
              style={{ background: "#8b5cf610", color: "#8b5cf6" }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentLetters.length > 0 ? (
              recentLetters.map((l) => (
                <ActivityItem
                  key={l.id}
                  type="letter"
                  title={l.name}
                  subtitle={`${l.division} • ${l.bacYear}`}
                  status={l.status}
                  onClick={() => router.push("/admin/dashboard/letters")}
                />
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: "#666" }}>
                No letters yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
