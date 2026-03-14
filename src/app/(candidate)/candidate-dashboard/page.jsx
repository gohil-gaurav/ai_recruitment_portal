"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUser } from "@/lib/auth";

const stages = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"];

function profileCompleteness(c) {
  if (!c) return 0;
  const fields = ["name", "email", "phone", "skills", "location", "education", "summary", "linkedin"];
  const filled = fields.filter((f) => c[f] && String(c[f]).trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

export default function CandidateDashboardPage() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user?.email) return;
    fetch(`/api/candidate-profile?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.notFound && !data.error) setCandidate(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const stageIdx = useMemo(() => {
    const s = candidate?.pipelineStatus || "Applied";
    const idx = stages.indexOf(s);
    return idx === -1 ? 0 : idx;
  }, [candidate?.pipelineStatus]);

  const skills = useMemo(
    () => (candidate?.skills || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 6),
    [candidate?.skills]
  );

  const completeness = useMemo(() => profileCompleteness(candidate), [candidate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="mono-label">Dashboard</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">
            {loading ? "Your candidate portal" : `Welcome, ${candidate?.name?.split(" ")[0] || "Candidate"}`}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Track application status, manage your resume, and keep your profile sharp.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/candidate-resume"
            className="pill bg-(--accent) text-black font-semibold hover:scale-105 transition"
          >
            Upload Resume
          </Link>
          <Link
            href="/applications"
            className="pill bg-white/10 border border-white/20 text-white hover:border-(--accent) hover:scale-105 transition"
          >
            View Applications
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 text-center text-gray-400">Loading dashboard...</div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <section className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mono-label">Application status</p>
                <p className="text-sm text-gray-300">Current pipeline stage</p>
              </div>
              <span className="pill bg-(--accent)/20 text-(--accent) text-xs border border-(--accent)/30">Live</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-400">Current Stage</p>
              <p className="mt-1 text-2xl font-semibold">{candidate?.pipelineStatus || "Not in pipeline"}</p>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {stages.map((s, idx) => (
                  <div
                    key={s}
                    className={`rounded-xl px-2 py-2 text-[11px] border text-center transition ${
                      idx <= stageIdx
                        ? "bg-(--accent) text-black border-(--accent) font-semibold"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {s.split(" ")[0]}
                  </div>
                ))}
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-(--accent) transition-all"
                  style={{ width: `${((stageIdx + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover-tilt">
                <p className="mono-label">Experience</p>
                <p className="mt-2 text-2xl font-semibold">
                  {candidate?.experienceYears ?? 0} <span className="text-sm font-normal text-gray-400">yrs</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover-tilt">
                <p className="mono-label">Profile completeness</p>
                <p className="mt-2 text-2xl font-semibold">{completeness}%</p>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-(--accent)" style={{ width: `${completeness}%` }} />
                </div>
              </div>
            </div>
          </section>

          <aside className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <p className="mono-label">Resume preview</p>
              <p className="text-sm text-gray-300">Parsed skills from your resume</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              {candidate?.resumeText ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Resume</p>
                      <p className="font-semibold text-white text-sm">{candidate.name}</p>
                    </div>
                    <span className="pill bg-white/10 text-white text-xs">Parsed</span>
                  </div>
                  <div className="divider-line my-3" />
                  <p className="text-xs text-gray-400 mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((s) => (
                        <span key={s} className="pill bg-white/8 text-white text-[11px] border border-white/10">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No skills extracted yet</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-2">No resume uploaded yet.</p>
                  <p className="text-xs text-gray-500">Upload a resume to auto-fill your profile.</p>
                </div>
              )}
              <Link
                href="/candidate-resume"
                className="mt-4 inline-flex items-center justify-center w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition"
              >
                {candidate?.resumeText ? "Replace resume" : "Upload resume"}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
