export type ContributionStatus = "pending" | "accepted" | "rejected";
export type Division =
  | "Mathematics"
  | "Science"
  | "Technical Mathematics"
  | "Management & Economics"
  | "Foreign Languages"
  | "Literature & Philosophy"
  | "Experimental Sciences";

export interface Contribution {
  id: string;
  name: string;
  email: string;
  bacYear: number;
  score: number;
  division: Division;
  driveLink: string;
  description: string;
  submittedAt: string;
  status: ContributionStatus;
  rejectionReason?: string;
}

export interface Letter {
  id: string;
  name: string;
  email: string;
  bacYear: number;
  score: number;
  division: Division;
  content: string;
  submittedAt: string;
  status: ContributionStatus;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  role: "visitor" | "contributor";
  contributions: number;
}

export interface Notification {
  id: string;
  type: "new_contribution" | "new_letter" | "system";
  message: string;
  time: string;
  read: boolean;
}

export const DIVISIONS: Division[] = [
  "Mathematics",
  "Science",
  "Technical Mathematics",
  "Management & Economics",
  "Foreign Languages",
  "Literature & Philosophy",
  "Experimental Sciences",
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "youb nader",
    email: "youb.nader@gmail.com",
    joinedAt: "2025-09-05",
    role: "contributor",
    contributions: 1,
  },
  {
    id: "2",
    name: "Rami Otsmane",
    email: "rimiti@esi.dz",
    joinedAt: "2026-01-15",
    role: "contributor",
    contributions: 1,
  },
  {
    id: "3",
    name: "youb nader",
    email: "youb.nader@gmail.com",
    joinedAt: "2025-09-05",
    role: "contributor",
    contributions: 1,
  },
  {
    id: "4",
    name: "Rami Otsmane",
    email: "rimiti@esi.dz",
    joinedAt: "2026-01-15",
    role: "contributor",
    contributions: 1,
  },
];

export const mockContributions: Contribution[] = [
  {
    id: "c1",
    name: "Rami Otsmane",
    email: "rimitsi@esi.dz",
    bacYear: 2022,
    score: 20,
    division: "Mathematics",
    driveLink: "https://drive.google.com/drive/folders/example",
    description: "description of the folder",
    submittedAt: "2026-03-27",
    status: "pending",
  },
  {
    id: "c2",
    name: "Rami Otsmane",
    email: "rimitsi@esi.dz",
    bacYear: 2022,
    score: 20,
    division: "Mathematics",
    driveLink: "https://drive.google.com/drive/folders/example",
    description: "description of the folder",
    submittedAt: "2026-03-27",
    status: "pending",
  },
  {
    id: "c3",
    name: "Rami Otsmane",
    email: "rimitsi@esi.dz",
    bacYear: 2022,
    score: 20,
    division: "Mathematics",
    driveLink: "https://drive.google.com/drive/folders/example",
    description: "description of the folder",
    submittedAt: "2026-03-27",
    status: "pending",
  },
  {
    id: "c4",
    name: "Rami Otsmane",
    email: "rimitsi@esi.dz",
    bacYear: 2022,
    score: 20,
    division: "Mathematics",
    driveLink: "https://drive.google.com/drive/folders/example",
    description: "description of the folder",
    submittedAt: "2026-03-27",
    status: "pending",
  },
];

export const mockLetters: Letter[] = [
  {
    id: "l1",
    name: "Rami Otsmane",
    email: "riri@esi.dz",
    bacYear: 2022,
    score: 20,
    division: "Mathematics",
    content: `a letter from riri`,
    submittedAt: "2026-03-27",
    status: "pending",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "new_contribution",
    message:
      "Rami Otsmane submitted a new contribution (Technical Mathematics)",
    time: "2026-03-27",
    read: false,
  },
  {
    id: "n2",
    type: "new_letter",
    message: "Rami Otsmane submitted a new experience letter",
    time: "2026-03-27",
    read: false,
  },
];

export const submissionsOverTime = [
  { month: "Oct", contributions: 2, letters: 1 },
  { month: "Nov", contributions: 5, letters: 3 },
  { month: "Dec", contributions: 3, letters: 2 },
  { month: "Jan", contributions: 8, letters: 5 },
  { month: "Feb", contributions: 6, letters: 4 },
  { month: "Mar", contributions: 12, letters: 7 },
];
