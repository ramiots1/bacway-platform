// src/components/AgentWidget.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// ─── Types ──────────────────────────────────────────────────────────────────

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const API_URL =
  process.env.NEXT_PUBLIC_AGENT_API_URL ||
  "https://bacway-backend1.onrender.com/api/v1/agent/chat";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Salam Alaykom! I'm Bacy 🐱, your study buddy for l'BAC.\n\n" +
    "Ask me anything about your speciality, find resources from top alumni, " +
    "or just say hi. I only know about high school and the Algerian BAC, " +
    "so let's keep it on topic!",
};

const MAX_HISTORY = 40;

const RTL_RE =
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u08A0-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;

function isRTL(text: string): boolean {
  return RTL_RE.test(text);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks the visualViewport so we can position the panel ABOVE the keyboard
  // on iOS Safari. { height, top } in pixels.
  const [vv, setVv] = useState<{ height: number; top: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detect mobile size on mount + when window resizes
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock background scroll on mobile when chat is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Track visualViewport — height shrinks when keyboard opens, top shifts when
  // user pinch-zooms or iOS does its weird offset thing.
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const v = window.visualViewport;
    if (!v) return;

    const update = () => {
      setVv({ height: v.height, top: v.offsetTop });
      // Keep messages scrolled to bottom while keyboard adjusts
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    };

    update();
    v.addEventListener("resize", update);
    v.addEventListener("scroll", update);
    return () => {
      v.removeEventListener("resize", update);
      v.removeEventListener("scroll", update);
    };
  }, [open]);

  // Auto-scroll on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (!nearBottom) return;
    const id = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, loading]);

  // Focus input when panel opens (delayed for animation)
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, [open]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-MAX_HISTORY).filter((m) => m !== WELCOME),
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many messages — slow down a bit 🐱");
        }
        throw new Error(`Server error (${res.status})`);
      }

      const { reply } = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ── Mobile panel positioning ────────────────────────────────────────────────
  // On mobile + iOS Safari with keyboard open, the trick is to use both height
  // AND top to track the visualViewport — otherwise the panel stays anchored
  // to the window top and the bottom (input) ends up under the keyboard.
  const mobileStyle: React.CSSProperties =
    isMobile && vv
      ? {
          height: `${vv.height}px`,
          top: `${vv.top}px`,
        }
      : {};

  return (
    <>
      {/* ── Floating button ── */}
      {!open && (
        <button
          aria-label="Open Bacy chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-7 border border-white/20 h-14 px-5 rounded-full bg-blue-900 hover:bg-blue-400 shadow-lg flex items-center gap-3 transition-transform hover:scale-105 z-[100] text-white"
        >
          <span className="font-medium text-sm sm:text-base">Ask Bacy</span>
          <Image src="/bacwayBadge.svg" alt="" width={32} height={32} />
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        <div
          className="
            fixed z-[300] bg-[#0C1114] shadow-2xl flex flex-col overflow-hidden
            inset-x-0 top-0 h-[100dvh] rounded-none border-0
            sm:inset-auto sm:bottom-5 sm:right-5
            sm:w-[min(500px,calc(100vw-2.5rem))]
            sm:h-[min(700px,calc(100dvh-7.5rem))]
            sm:top-auto
            sm:rounded-2xl sm:border sm:border-white/20
          "
          style={mobileStyle}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:py-3 py-5 border-b border-white/15 bg-[#0C1114] shrink-0">
            <div className="flex items-center gap-4 sm:gap-2">
              <Image
                src="/bacwayBadge.svg"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 sm:w-[30px] sm:h-[30px]"
              />
              <div>
                <p className="text-white text-lg sm:text-sm font-semibold leading-tight">
                  Bacy
                </p>
                <p className="text-white/40 sm:text-[10px] text-xs">
                  This is a test version ;)
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/50 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center -mr-2"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 chat-scrollbar"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <Bubble role="assistant" content="…" typing />}
            {error && (
              <Bubble
                role="assistant"
                content="Something went wrong, try again later or please report the issue."
              />
            )}
          </div>

          {/* Input */}
          <div className="p-3 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-2 items-center bg-[rgb(20,25,28)] border border-white/15 rounded-lg px-3 py-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                dir="auto"
                placeholder="Ask me something"
                disabled={loading}
                style={{ fontSize: "16px" }}
                className="flex-1 bg-transparent text-white sm:!text-sm px-1 py-1 placeholder-white/25 focus:outline-none resize-none max-h-24"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="h-10 px-4 bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors shrink-0"
              >
                Send
              </button>
            </div>
            <p className="text-white/25 text-[10px] mt-1.5 px-0.5">
              Powered by Bacway Team, answers come from our community.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Bubble ─────────────────────────────────────────────────────────────────

function Bubble({
  role,
  content,
  typing,
}: {
  role: Role;
  content: string;
  typing?: boolean;
}) {
  const isUser = role === "user";
  const rtl = !typing && isRTL(content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        dir={rtl ? "rtl" : "ltr"}
        className={`max-w-[85%] px-3 py-2 rounded-2xl sm:text-base text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white/8 text-white rounded-bl-sm"
        } ${rtl ? "text-right font-arabic" : ""}`}
      >
        {typing ? <TypingDots /> : <Linkify text={content} />}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span
        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}

function Linkify({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-300 hover:text-blue-200 break-all"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}