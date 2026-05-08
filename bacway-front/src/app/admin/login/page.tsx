// src/app/admin/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthed, login } from "../auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthed()) router.replace("/admin");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (login(pin)) {
      router.replace("/admin");
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
        <h1 className="text-xl text-black font-semibold mb-1">Bacway Admin</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the admin PIN to continue.</p>

        <label htmlFor="pin" className="block text-sm text-black font-medium mb-2">
          PIN
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-gray-900 text-black focus:border-transparent text-base"
          placeholder="••••"
          autoFocus
        />

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={!pin}
          className="mt-6 w-full bg-gray-900 text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
