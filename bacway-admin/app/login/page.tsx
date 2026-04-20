"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_PIN = "1234";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("bw_admin_auth")
    ) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const configuredPin = localStorage.getItem("bw_admin_pin") ?? DEFAULT_PIN;
    if (pin.trim() !== configuredPin) {
      setError("Incorrect PIN");
      return;
    }
    setLoading(true);
    localStorage.setItem("bw_admin_auth", "true");
    router.replace("/dashboard");
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#0d0d0d" }}
    >
      {/* Logo above the card — exactly like the screenshot */}
      <div className="mb-6 text-center">
        <span className="text-2xl font-black tracking-tight text-white">
          BAC<span className="font-thin">WAY</span>
        </span>
        <span
          className="text-2xl ml-2 font-light tracking-[0.18em]"
          style={{ color: "#888" }}
        >
          ADMIN
        </span>
      </div>

      {/* Card */}
      <section
        className="w-full rounded-2xl p-8"
        style={{
          maxWidth: 340,
          background: "#141414",
          border: "1px solid #222",
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <h1 className="text-base font-semibold text-white">Welcome team !</h1>
        <p className="text-xs mt-1 mb-6" style={{ color: "#666" }}>
          Keep your active PIN to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pin"
              className="block text-xs font-semibold mb-2 tracking-wide"
              style={{ color: "#aaa" }}
            >
              ADMIN PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="off"
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none"
              style={{
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                caretColor: "#00c8ff",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#00c8ff55")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: "#00c8ff", color: "#000" }}
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
