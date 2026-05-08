// src/app/admin/api.ts
// Thin wrapper around the admin endpoints documented in ADMIN_API.md.

const BASE = process.env.NEXT_PUBLIC_ADMIN_API_URL!;

export type ContributionStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type BacSpeciality =
  | "MATHS"
  | "SCIENCE"
  | "MATH_TECH"
  | "GESTION"
  | "LETTRE"
  | "LANGUES";
export type ContactType =
  | "INSTAGRAM"
  | "PHONE_NUMBER"
  | "FACEBOOK"
  | "TWITTER"
  | "LINKEDIN"
  | "EMAIL"
  | "OTHER";

export interface Contact {
  id: number;
  type: ContactType;
  contact: string;
  contributorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: number;
  folderName: string;
  folderLink: string;
  description: string | null;
  contributorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contributor {
  id: number;
  email: string;
  fullName: string;
  bacYear: number;
  grade: string; // serialized as string (Prisma Decimal)
  bacSpeciality: BacSpeciality;
  pictureLink: string | null;
  letter: string | null;
  status: ContributionStatus;
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
  resources: Resource[];
}

export interface ListResponse {
  data: Contributor[];
  total: number;
  limit: number;
  offset: number;
  metrics: { total: number; pending: number };
}

export interface DecisionResponse {
  contributor: Contributor;
  emailSent: boolean;
  emailSkipped: boolean;
}

export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | string[];
}

export interface ListParams {
  status?: ContributionStatus;
  bacSpeciality?: BacSpeciality;
  bacYear?: number;
  sortByGrade?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let err: ApiError | null = null;
    try {
      err = await res.json();
    } catch {
      // ignore
    }
    const msg = err
      ? Array.isArray(err.message)
        ? err.message.join(", ")
        : err.message
      : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export function listContributions(params: ListParams = {}): Promise<ListResponse> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.bacSpeciality) q.set("bacSpeciality", params.bacSpeciality);
  if (params.bacYear !== undefined) q.set("bacYear", String(params.bacYear));
  if (params.sortByGrade) q.set("sortByGrade", params.sortByGrade);
  if (params.limit !== undefined) q.set("limit", String(params.limit));
  if (params.offset !== undefined) q.set("offset", String(params.offset));

  const qs = q.toString();
  const url = `${BASE}/admin/contributions${qs ? `?${qs}` : ""}`;
  return fetch(url, { cache: "no-store" }).then((r) => handle<ListResponse>(r));
}

export function getContribution(id: number): Promise<Contributor> {
  return fetch(`${BASE}/admin/contributions/${id}`, { cache: "no-store" }).then(
    (r) => handle<Contributor>(r),
  );
}

export function acceptContribution(id: number): Promise<DecisionResponse> {
  return fetch(`${BASE}/admin/contributions/${id}/accept`, {
    method: "PATCH",
  }).then((r) => handle<DecisionResponse>(r));
}

export function rejectContribution(id: number): Promise<DecisionResponse> {
  return fetch(`${BASE}/admin/contributions/${id}/reject`, {
    method: "PATCH",
  }).then((r) => handle<DecisionResponse>(r));
}