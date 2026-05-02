"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import {
  mockContributions,
  mockLetters,
  mockNotifications,
  Contribution,
  Letter,
  Notification,
  ContributionStatus,
} from "./data";

interface AdminStore {
  contributions: Contribution[];
  letters: Letter[];
  notifications: Notification[];
  unreadCount: number;
  acceptContribution: (id: string) => void;
  rejectContribution: (id: string, reason: string) => void;
  acceptLetter: (id: string) => void;
  rejectLetter: (id: string, reason: string) => void;
  markAllRead: () => void;
}

const Ctx = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [contributions, setContributions] =
    useState<Contribution[]>(mockContributions);
  const [letters, setLetters] = useState<Letter[]>(mockLetters);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const acceptContribution = (id: string) =>
    setContributions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "accepted" as ContributionStatus } : c,
      ),
    );

  const rejectContribution = (id: string, reason: string) =>
    setContributions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "rejected" as ContributionStatus,
              rejectionReason: reason,
            }
          : c,
      ),
    );

  const acceptLetter = (id: string) =>
    setLetters((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: "accepted" as ContributionStatus } : l,
      ),
    );

  const rejectLetter = (id: string, reason: string) =>
    setLetters((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "rejected" as ContributionStatus,
              rejectionReason: reason,
            }
          : l,
      ),
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <Ctx.Provider
      value={{
        contributions,
        letters,
        notifications,
        unreadCount,
        acceptContribution,
        rejectContribution,
        acceptLetter,
        rejectLetter,
        markAllRead,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
