"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  skills: "",
  experience: "",
  location: "",
  education: "",
  summary: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

export default function CandidateProfilePage() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user?.email) return;
    fetch(`/api/candidate-profile?email=${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.notFound && !data.error) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            skills: data.skills || "",
            experience: String(data.experienceYears ?? ""),
            location: data.location || "",
            education: data.education || "",
            summary: data.summary || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolio: data.portfolio || "",
          });
        } else {
          // Pre-fill email from auth
          setForm((p) => ({ ...p, email: user.email, name: user.name || "" }));
        }
      })
      .catch(() => {
        const user = getUser();
        setForm((p) => ({ ...p, email: user?.email || "", name: user?.name || "" }));
      })
      .finally(() => setLoading(false));
  }, []);

  const update = (k, v) => {
    setSaved(false);
    setForm((p) => ({ ...p, [k]: v }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/candidate-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          phone: form.phone,
          skills: form.skills,
          experienceYears: form.experience,
          location: form.location,
          education: form.education,
          summary: form.summary,
          linkedin: form.linkedin,
          github: form.github,
          portfolio: form.portfolio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setSaved(true);
    } catch (e) {
      setError(e?.message || "Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mono-label">Profile</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold">Candidate profile</h1>
        <p className="mt-1 text-sm text-gray-400">Keep your details and resume aligned for applications.</p>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-8 text-center text-gray-400">Loading profile...</div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
          <section className="glass-card rounded-2xl p-5">
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Email</label>
                  <input
                    value={form.email}
                    readOnly
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Skills</label>
                  <input
                    value={form.skills}
                    onChange={(e) => update("skills", e.target.value)}
                    placeholder="Comma-separated"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-200">Years of Experience</label>
                  <input
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-200">Education</label>
                <input
                  value={form.education}
                  onChange={(e) => update("education", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-200">Summary</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {["linkedin", "github", "portfolio"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm text-gray-200 capitalize">{field}</label>
                    <input
                      value={form[field]}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={`https://...`}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:border-(--accent) focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-200">Resume</label>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-400">Upload or replace your resume file</p>
                  <a
                    href="/candidate-resume"
                    className="pill bg-white/10 border border-white/15 text-white hover:border-(--accent) hover:scale-105 transition text-xs"
                  >
                    Upload
                  </a>
                </div>
              </div>

              {error && <p className="text-sm text-red-300">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="pill bg-(--accent) text-black font-semibold hover:scale-105 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                {saved && <span className="text-sm text-(--accent)">Saved</span>}
              </div>
            </form>
          </section>

          <aside className="glass-card rounded-2xl p-5 space-y-4 hover-tilt">
            <div>
              <p className="mono-label">Preview</p>
              <p className="text-sm text-gray-300">How recruiters will see you</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-gray-400">Candidate</p>
              <p className="text-xl font-semibold">{form.name || "—"}</p>
              <p className="text-sm text-gray-400 mt-1">{form.email || "—"}</p>
              {form.location && <p className="text-xs text-gray-500 mt-1">{form.location}</p>}
              <div className="divider-line my-4" />
              <p className="text-xs text-gray-400 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(form.skills || "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 6)
                  .map((s) => (
                    <span key={s} className="pill bg-white/8 text-white text-[11px] border border-white/10">
                      {s}
                    </span>
                  ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Keep your skills concise and aligned to the roles you&apos;re targeting.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
