"use client";
import { useState } from "react";
import { mockUsers } from "../../lib/data";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const total = mockUsers.length;
  const contributors = mockUsers.filter((u) => u.role === "contributor").length;
  const visitors = mockUsers.filter((u) => u.role === "visitor").length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-sm mt-1" style={{ color: "#555" }}>
          All registered users and contributors
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Users", value: total, color: "#00c8ff" },
          { label: "Contributors", value: contributors, color: "#10b981" },
          { label: "Visitors", value: visitors, color: "#a78bfa" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5 border"
            style={{ background: "#111", borderColor: "#1f1f1f" }}
          >
            <div className="text-3xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-sm mt-1" style={{ color: "#555" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: "#444" }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none"
          style={{ background: "#111", border: "1px solid #1f1f1f" }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "#111", borderColor: "#1f1f1f" }}
      >
        <div
          className="grid grid-cols-4 px-5 py-3 border-b text-xs font-medium uppercase tracking-widest"
          style={{ borderColor: "#1a1a1a", color: "#444" }}
        >
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            className="grid grid-cols-4 px-5 py-4 items-center border-b transition-colors"
            style={{
              borderColor: "#1a1a1a",
              background: i % 2 === 0 ? "#111" : "#0f0f0f",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: "#00c8ff18", color: "#00c8ff" }}
              >
                {u.name.charAt(0)}
              </div>
              <span className="text-sm text-white font-medium">{u.name}</span>
            </div>
            <span className="text-sm" style={{ color: "#666" }}>
              {u.email}
            </span>
            <span>
              <span
                className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                style={{
                  background:
                    u.role === "contributor" ? "#10b98118" : "#a78bfa18",
                  color: u.role === "contributor" ? "#10b981" : "#a78bfa",
                }}
              >
                {u.role}
              </span>
            </span>
            <span className="text-sm" style={{ color: "#555" }}>
              {u.joinedAt}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: "#444" }}>
            <p className="text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
