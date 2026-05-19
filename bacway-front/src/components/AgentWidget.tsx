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
    "Salam Alaykom! I'm the Bacway Cat 🐱, your study buddy for l'BAC.\n\n" +
    "Ask me anything about your speciality, find resources from top alumni, " +
    "or just say hi. I only know about high school and the Algerian BAC, " +
    "so let's keep it on topic!",
};

const MAX_HISTORY = 40; // matches backend cap

// Hebrew + Arabic + Arabic Supplement + Arabic Extended + Arabic Presentation Forms
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  // Only auto-scroll if user is already near the bottom (within 100px)
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  if (!nearBottom) return;

  const id = requestAnimationFrame(() => {
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  });
  return () => cancelAnimationFrame(id);
}, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
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
          // Send last N messages, excluding the seed welcome (it's pure UI)
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

  return (
    <>
      {/* ── Floating button ── */}
      {!open && (
        <button
          aria-label="Open Bacway Cat chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-7 border border-white/20 right-5 h-14 px-5 rounded-full bg-blue-900 hover:bg-blue-400 shadow-lg flex items-center gap-3 transition-transform hover:scale-105 z-[100] text-white"
        >
          <span className="font-medium text-base">Ask Bacway Agent</span>
          <Image
            src="/bacwayBadge.svg"
            alt=""
            width={32}
            height={32}
          />
        </button>
      )}

      {/* ── Chat panel ── */}
      {open && (
        
        <div className=" fixed bottom-5 right-5 sm:w-[min(500px,calc(100vw-2.5rem))] w-[min(380px,calc(100vw-2.5rem))] h-[calc(100vh-7.5rem)] bg-[#0C1114] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/15 bg-[#0C1114]">
            <div className="flex items-center gap-2">
              <Image src="/bacwayBadge.svg" alt="" width={28} height={28} />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  Bacway Cat
                </p>
                <p className="text-white/40 text-[10px]">
                  This is a test version ;)
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/50 hover:text-white text-2xl leading-none w-7 h-7 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3
             [&::-webkit-scrollbar]:w-1.5
             [&::-webkit-scrollbar-track]:bg-transparent
             [&::-webkit-scrollbar-thumb]:bg-white/15
             [&::-webkit-scrollbar-thumb]:rounded-full
             [&::-webkit-scrollbar-thumb]:hover:bg-white/30
             [&::-webkit-scrollbar-thumb]: m-1"
          >
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && (
              <Bubble role="assistant" content="…" typing />
            )}
            {error && (
              <Bubble
                role="assistant"
                content={`Something went wrong, try again later or please report the issue.`}
              />
            )}
          </div>

          {/* Input */}
          <div className="p-3">
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
                className="flex-1 bg-transparent text-white text-sm px-1 py-1 placeholder-white/25 focus:outline-none resize-none max-h-24"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="h-9 px-4 bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors"
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
            : "bg-white/8 text-white rounded-bl-sm "
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

// Turn plain-text URLs into clickable links without dragging in a markdown lib
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