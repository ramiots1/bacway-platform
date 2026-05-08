// src/app/admin/contributions/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Contributor,
  ContributionStatus,
  acceptContribution,
  getContribution,
  rejectContribution,
} from "../../api";

const STATUS_STYLES: Record<ContributionStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function ContributionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [c, setC] = useState<Contributor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<
    null | "accept" | "reject"
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContribution(id);
      setC(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Invalid contribution id");
      setLoading(false);
      return;
    }
    load();
  }, [id, load]);

  async function handleAccept() {
    if (!c) return;
    setActionLoading("accept");
    setToast(null);
    try {
      const res = await acceptContribution(c.id);
      setC(res.contributor);
      setToast(
        res.emailSkipped ? "Already accepted." : "Contribution accepted.",
      );
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject() {
    if (!c) return;
    if (!confirm("Reject this contribution?")) return;
    setActionLoading("reject");
    setToast(null);
    try {
      const res = await rejectContribution(c.id);
      setC(res.contributor);
      setToast(
        res.emailSkipped ? "Already rejected." : "Contribution rejected.",
      );
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  if (error || !c) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">{error ?? "Not found"}</p>
        <button
          onClick={() => router.back()}
          className="text-sm underline text-gray-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{c.fullName}</h1>
            <p className="text-sm text-gray-500 mt-1">{c.email}</p>
            <span
              className={`inline-block mt-3 px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[c.status]}`}
            >
              {c.status}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              disabled={actionLoading !== null || c.status === "ACCEPTED"}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === "accept" ? "Accepting…" : "Accept"}
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading !== null || c.status === "REJECTED"}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading === "reject" ? "Rejecting…" : "Reject"}
            </button>
          </div>
        </div>

        {toast && (
          <div className="mt-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
            {toast}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Bac details">
          <Field label="Year">{c.bacYear}</Field>
          <Field label="Speciality">{c.bacSpeciality}</Field>
          <Field label="Grade">{Number(c.grade).toFixed(2)} / 20</Field>
          <Field label="Submitted">
            {new Date(c.createdAt).toLocaleString()}
          </Field>
        </Section>

        <Section title="Picture">
          {c.pictureLink ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.pictureLink}
              alt={c.fullName}
              className="rounded-md max-h-64 object-cover border border-gray-200"
            />
          ) : (
            <p className="text-sm text-gray-500">No picture provided.</p>
          )}
        </Section>
      </div>

      <Section title="Motivation letter">
        {c.letter ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
            {c.letter}
          </p>
        ) : (
          <p className="text-sm text-gray-500">No letter provided.</p>
        )}
      </Section>

      <Section title={`Contacts (${c.contacts.length})`}>
        {c.contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {c.contacts.map((ct) => (
              <li
                key={ct.id}
                className="py-2 flex items-center justify-between text-sm"
              >
                <span className="text-gray-500 w-32">{ct.type}</span>
                <span className="font-medium text-gray-900 break-all">
                  {ct.contact}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={`Resources (${c.resources.length})`}>
        {c.resources.length === 0 ? (
          <p className="text-sm text-gray-500">No resources.</p>
        ) : (
          <ul className="space-y-3">
            {c.resources.map((r) => (
              <li
                key={r.id}
                className="border border-gray-200 rounded-md p-3 text-sm"
              >
                <a
                  href={r.folderLink}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-gray-900 underline hover:no-underline"
                >
                  {r.folderName}
                </a>
                {r.description && (
                  <p className="text-gray-600 mt-1">{r.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between text-sm py-1.5">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{children}</span>
    </div>
  );
}