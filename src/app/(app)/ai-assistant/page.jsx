"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Find React developers with 3+ years experience",
  "Show candidates in Bangalore",
  "List Python engineers with MongoDB skills",
  "Who has the most experience?",
  "Find full stack developers",
];

const PIPELINE_COLORS = {
  Applied: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Shortlisted: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Interview: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Offer: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Hired: "bg-green-500/20 text-green-300 border-green-500/30",
};

// Render bold (**text**), bullet lines, and arrow lines from the reply string
function FormattedMessage({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        const isBullet = /^[•\-]/.test(line.trim());
        const isArrow = /^→/.test(line.trim());
        const isItalic = /^_.*_$/.test(line.trim());
        const clean = line.replace(/^[•\-→]\s*/, "").replace(/^_|_$/g, "");

        const renderBold = (str) =>
          str.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-white font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          );

        if (isItalic) {
          return (
            <p key={i} className="text-gray-500 text-xs italic">
              {renderBold(clean)}
            </p>
          );
        }

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--accent)/60 shrink-0" />
              <span className="text-gray-200">{renderBold(clean)}</span>
            </div>
          );
        }

        if (isArrow) {
          return (
            <div key={i} className="flex gap-2 items-start pl-1">
              <span className="text-(--accent) text-xs shrink-0 mt-0.5">→</span>
              <span className="text-gray-200 text-xs">{renderBold(clean)}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-gray-200">
            {renderBold(line)}
          </p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-(--accent)/60 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function CandidateCard({ c }) {
  const skills = (c.skills || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  const stageClass = PIPELINE_COLORS[c.pipelineStatus] || PIPELINE_COLORS.Applied;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-(--accent)/40 transition group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{c.name || "Unnamed"}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{c.email}</p>
        </div>
        <span className={`pill text-[11px] border shrink-0 ${stageClass}`}>
          {c.pipelineStatus || "Applied"}
        </span>
      </div>

      {c.summary && (
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{c.summary}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {skills.map((s) => (
          <span key={s} className="pill bg-white/8 text-white text-[11px] border border-white/10">
            {s}
          </span>
        ))}
        {skills.length === 0 && <span className="text-xs text-gray-500">No skills listed</span>}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs text-gray-400">
          <span>{c.experienceYears ?? 0} yrs</span>
          {c.location && <span>· {c.location}</span>}
        </div>
        <Link
          href={`/candidate/${c.id}`}
          className="text-xs text-(--accent) hover:underline font-medium"
        >
          View profile →
        </Link>
      </div>
    </div>
  );
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        `Hi! I'm your AI recruiting assistant.\n\nI can search candidates by **skills**, **location**, **experience**, or **name**.\n\nTry:\n• "Find React developers with 3+ years"\n• "Show candidates in Bangalore"\n• "List Python engineers"`,
      candidates: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const chatScrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendQuery = async (query) => {
    if (!query.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: query.trim(), candidates: [] }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply || "Here are the results.",
          candidates: data.candidates || [],
        },
      ]);
      if (data.candidates?.length === 1) setSelectedCandidate(data.candidates[0]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Check your connection and try again.", candidates: [] },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  // Latest candidates from last assistant message
  const latestCandidates =
    [...messages].reverse().find((m) => m.role === "assistant" && m.candidates?.length > 0)?.candidates || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="mono-label">AI Assistant</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">Recruiting AI</h1>
          <p className="mt-1 text-sm text-gray-400">
            Natural language search · candidate summaries · pipeline insights
          </p>
        </div>
        <Link
          href="/candidates"
          className="pill bg-white/10 border border-white/15 text-white hover:border-(--accent) hover:scale-105 transition self-start"
        >
          Browse All Candidates
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-6 items-start">
        {/* ── Chat panel ── */}
        <section className="glass-card rounded-2xl flex flex-col" style={{ height: "76vh" }}>
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-(--accent)/20 border border-(--accent)/30 flex items-center justify-center text-xs font-bold text-(--accent)">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold">Recruiting Assistant</p>
                <p className="text-xs text-gray-400">
                  {loading ? (
                    <span className="text-(--accent)">Thinking...</span>
                  ) : (
                    "Online · ready to search"
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([{
                  role: "assistant",
                  content: "Chat cleared. What would you like to search for?",
                  candidates: [],
                }]);
                setSelectedCandidate(null);
              }}
              className="text-xs text-gray-400 hover:text-white transition pill border border-white/10 hover:border-white/30"
            >
              Clear
            </button>
          </div>

          {/* messages */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-xl bg-(--accent)/20 border border-(--accent)/30 flex items-center justify-center text-[10px] font-bold text-(--accent) shrink-0 mt-1">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] space-y-3 ${m.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-(--accent) text-black rounded-tr-sm"
                        : "bg-white/8 border border-white/10 rounded-tl-sm"
                    }`}
                  >
                    {m.role === "user" ? (
                      <p className="text-sm font-medium">{m.content}</p>
                    ) : (
                      <FormattedMessage text={m.content} />
                    )}
                  </div>

                  {/* Inline candidate cards for small result sets */}
                  {m.role === "assistant" && m.candidates?.length > 0 && m.candidates.length <= 3 && (
                    <div className="w-full space-y-2">
                      {m.candidates.map((c) => (
                        <CandidateCard key={c.id} c={c} />
                      ))}
                    </div>
                  )}

                  {m.role === "assistant" && m.candidates?.length > 3 && (
                    <p className="text-xs text-gray-400">
                      {m.candidates.length} results shown in the panel →
                    </p>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-gray-200 shrink-0 mt-1">
                    HR
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-xl bg-(--accent)/20 border border-(--accent)/30 flex items-center justify-center text-[10px] font-bold text-(--accent) shrink-0 mt-1">
                  AI
                </div>
                <div className="rounded-2xl px-4 py-2 bg-white/8 border border-white/10 rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* suggestions */}
          <div className="px-5 pt-2 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendQuery(s)}
                disabled={loading}
                className="shrink-0 text-xs rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-gray-300 hover:border-(--accent)/50 hover:text-white transition disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>

          {/* input */}
          <form onSubmit={handleSubmit} className="px-5 py-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Find developers with React and Node.js..."
                disabled={loading}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none disabled:opacity-50 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="pill bg-(--accent) text-black font-bold px-5 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 shrink-0"
              >
                {loading ? "…" : "Send"}
              </button>
            </div>
          </form>
        </section>

        {/* ── Results panel ── */}
        <section className="glass-card rounded-2xl p-5 space-y-4" style={{ maxHeight: "76vh", overflowY: "auto" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="mono-label">Results</p>
              <p className="text-sm text-gray-300">
                {latestCandidates.length === 0
                  ? "No results yet"
                  : `${latestCandidates.length} candidate${latestCandidates.length !== 1 ? "s" : ""} found`}
              </p>
            </div>
            {latestCandidates.length > 0 && (
              <span className="pill bg-(--accent)/15 text-(--accent) text-[11px] border border-(--accent)/30">
                AI matched
              </span>
            )}
          </div>

          {latestCandidates.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
              <div className="w-10 h-10 rounded-2xl bg-(--accent)/10 border border-(--accent)/20 flex items-center justify-center mx-auto mb-3 text-sm">
                🔍
              </div>
              <p className="text-sm text-gray-400 mb-1">Ask me anything</p>
              <p className="text-xs text-gray-500">Results will appear here after your search.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestCandidates.map((c) => (
                <CandidateCard key={c.id} c={c} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
