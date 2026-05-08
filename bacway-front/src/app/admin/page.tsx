// src/app/admin/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import {
  listContributions,
  type ContributionStatus,
  type BacSpeciality,
  type Contributor,
} from "./api";

const PAGE_SIZE = 20;

const STATUS_OPTIONS: (ContributionStatus | "ALL")[] = [
  "ALL",
  "PENDING",
  "ACCEPTED",
  "REJECTED",
];

const SPECIALITY_OPTIONS: (BacSpeciality | "ALL")[] = [
  "ALL",
  "MATHS",
  "SCIENCE",
  "MATH_TECH",
  "GESTION",
  "LETTRE",
  "LANGUES",
];

const STATUS_STYLES: Record<ContributionStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const [rows, setRows] = useState<Contributor[]>([]);
  const [total, setTotal] = useState(0);
  const [metrics, setMetrics] = useState({ total: 0, pending: 0 });
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | "ALL">(
    "PENDING",
  );
  const [specFilter, setSpecFilter] = useState<BacSpeciality | "ALL">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listContributions({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        bacSpeciality: specFilter === "ALL" ? undefined : specFilter,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setRows(res.data);
      setTotal(res.total);
      setMetrics(res.metrics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, specFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [statusFilter, specFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricCard label="Total contributions" value={metrics.total} />
        <MetricCard
          label="Pending review"
          value={metrics.pending}
          accent="amber"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap gap-3">
        <Select
          label="Status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as ContributionStatus | "ALL")}
          options={STATUS_OPTIONS}
        />
        <Select
          label="Speciality"
          value={specFilter}
          onChange={(v) => setSpecFilter(v as BacSpeciality | "ALL")}
          options={SPECIALITY_OPTIONS}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : loading ? (
          <div className="p-6 text-sm text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No contributions match these filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <Th>Name</Th>
                  <Th>Bac year</Th>
                  <Th>Speciality</Th>
                  <Th>Grade</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                  <Th />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>
                      <div className="font-medium">{r.fullName}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                    </Td>
                    <Td>{r.bacYear}</Td>
                    <Td>{r.bacSpeciality}</Td>
                    <Td>{Number(r.grade).toFixed(2)}</Td>
                    <Td>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </Td>
                    <Td>{new Date(r.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <Link
                        href={`/admin/contributions/${r.id}`}
                        className="text-gray-900 underline hover:no-underline"
                      >
                        View
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && rows.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Page {page + 1} of {totalPages} — {total} result
            {total === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- small helpers ---------- */

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "amber";
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`text-3xl font-semibold mt-1 ${
          accent === "amber" ? "text-amber-700" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="text-sm">
      <span className="block text-xs text-gray-500 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-medium">{children}</th>;
}

function Td({ children }: { children?: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}