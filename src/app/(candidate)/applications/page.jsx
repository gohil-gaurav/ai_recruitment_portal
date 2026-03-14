"use client";

import { useEffect, useMemo, useState } from "react";
import { getUser } from "@/lib/auth";

const pipeline = ["Applied", "Shortlisted", "Interview", "Offer", "Hired"];

export default function ApplicationsPage() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user?.email) return;
    fetch(`/api/candidate-profile?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.notFound && !data.error) setCandidate(data);
      })
      .catch(() => setError("Failed to load application data."))
      .finally(() => setLoading(false));
  }, []);

  const stageIndex = (stage) => {
    const idx = pipeline.indexOf(stage);
    return idx === -1 ? 0 : idx;
  };

  const stats = useMemo(() => {
    const byStage = Object.fromEntries(pipeline.map((p) => [p, 0]));
    if (candidate?.pipelineStatus) {
      byStage[candidate.pipelineStatus] = (byStage[candidate.pipelineStatus] ?? 0) + 1;
    }
    return byStage;
  }, [candidate]);

  const items = useMemo(() => {
    if (!candidate) return [];
    return [
      {
        id: candidate.id,
        role: "Application",
        company: "VectorHire",
        stage: candidate.pipelineStatus || "Applied",
        updatedAt: new Date(candidate.updatedAt).toLocaleDateString(),
      },
    ];
  }, [candidate]);

  return (
    <div className="space-y-6">
      <div>
        <p className="mono-label">Applications</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">My applications</h1>
        <p className="mt-1 text-sm text-gray-400">Track your job pipeline status end-to-end.</p>
      </div>

      {loading && (
        <div className="glass-card rounded-2xl p-8 text-center text-gray-400">Loading...</div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pipeline.map((s) => (
              <div
                key={s}
                className={`glass-card rounded-2xl p-4 hover-tilt ${
                  candidate?.pipelineStatus === s ? "ring-1 ring-(--accent)" : ""
                }`}
              >
                <p className="mono-label">{s}</p>
                <p className="mt-2 text-2xl font-semibold">{stats[s] ?? 0}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="mono-label">Status</p>
                <p className="text-sm text-gray-300">Latest updates</p>
              </div>
              <span className="pill bg-white/8 text-white text-xs">Pipeline</span>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">
                No application found. Upload your resume to get started.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/3">
                <table className="w-full text-sm text-left">
                  <thead className="uppercase text-[11px] tracking-[0.15em] text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Stage</th>
                      <th className="px-4 py-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => {
                      const idx = stageIndex(it.stage);
                      return (
                        <tr key={it.id} className="border-b border-white/5 hover:bg-white/5 transition align-middle">
                          <td className="px-4 py-4">
                            <div className="font-semibold text-white">{candidate?.name || "You"}</div>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-xs">{candidate?.email}</td>
                          <td className="px-4 py-4">
                            <span className="pill bg-(--accent) text-black text-xs">{it.stage}</span>
                            <div className="mt-2 h-1.5 w-40 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-(--accent)"
                                style={{ width: `${((idx + 1) / pipeline.length) * 100}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-gray-200">{it.updatedAt}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
