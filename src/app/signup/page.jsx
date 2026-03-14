"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { setUser } from "@/lib/auth";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  Briefcase, 
  UserCircle, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Target
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = useMemo(() => (role === "HR" ? "/dashboard" : "/candidate-dashboard"), [role]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }
      if (role === "HR" && !company.trim()) {
        setError("Company name is required for HR accounts.");
        setLoading(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUser({ email, role, name });
      router.push(redirectTo);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#0b0b0f] via-[#0f0f12] to-black text-white">
      <motion.div 
        className="magic-grid animated-grid" 
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="aceternity-spotlight" style={{ top: 100, left: 140 }} aria-hidden />
      <div className="aceternity-spotlight" style={{ bottom: -80, right: 140 }} aria-hidden />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl neon-border flex items-center justify-center font-black text-lg bg-linear-to-br from-(--accent)/10 to-transparent group-hover:scale-105 transition">
              V
            </div>
            <div>
              <p className="font-bold text-base">VectorHire AI</p>
              <p className="text-xs text-gray-400">Create your account</p>
            </div>
          </Link>
          <Link
            href="/login"
            className="pill bg-white/10 border border-white/15 text-white hover:border-(--accent) animated-button text-sm"
          >
            Sign In
          </Link>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          {/* Signup Form Section */}
          <motion.section 
            className="glass-card rounded-3xl p-8 md:p-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent)/10 border border-(--accent)/30 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-(--accent)" />
              <span className="text-xs text-(--accent) font-semibold uppercase tracking-wider">Get Started Free</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Start hiring smarter
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Create your account and unlock AI-powered recruitment tools
            </p>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <User className="w-4 h-4 text-(--accent)" />
                    Full Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-(--accent)" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-(--accent)" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters recommended</p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-(--accent)" />
                  I am signing up as
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setRole("HR")}
                    className={`group rounded-xl p-4 border-2 transition-all text-left ${
                      role === "HR"
                        ? "border-(--accent) bg-linear-to-br from-(--accent)/20 to-(--accent)/5"
                        : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                        role === "HR" 
                          ? "bg-(--accent)/30" 
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}>
                        <Briefcase className={`w-5 h-5 ${role === "HR" ? "text-(--accent)" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${role === "HR" ? "text-white" : "text-gray-300"}`}>
                          HR / Recruiter
                        </p>
                        <p className="text-xs text-gray-500">Hire talent</p>
                      </div>
                    </div>
                    {role === "HR" && (
                      <div className="flex items-center gap-1 text-xs text-(--accent)">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selected</span>
                      </div>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => setRole("CANDIDATE")}
                    className={`group rounded-xl p-4 border-2 transition-all text-left ${
                      role === "CANDIDATE"
                        ? "border-(--accent) bg-linear-to-br from-(--accent)/20 to-(--accent)/5"
                        : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                        role === "CANDIDATE" 
                          ? "bg-(--accent)/30" 
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}>
                        <UserCircle className={`w-5 h-5 ${role === "CANDIDATE" ? "text-(--accent)" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${role === "CANDIDATE" ? "text-white" : "text-gray-300"}`}>
                          Candidate
                        </p>
                        <p className="text-xs text-gray-500">Find jobs</p>
                      </div>
                    </div>
                    {role === "CANDIDATE" && (
                      <div className="flex items-center gap-1 text-xs text-(--accent)">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selected</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Company Name (conditional) */}
              {role === "HR" && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-(--accent)" />
                    Company Name
                  </label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all"
                    disabled={loading}
                  />
                </motion.div>
              )}

              {error && (
                <motion.div 
                  className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  disabled={loading}
                  className="flex-1 rounded-full bg-(--accent) text-black font-bold text-base px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_30px_rgba(198,243,107,0.3)]"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-(--accent) hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-(--accent) hover:underline">Privacy Policy</a>
              </p>
            </form>
          </motion.section>

          {/* Benefits Sidebar */}
          <motion.aside 
            className="glass-card rounded-3xl p-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-(--accent)" />
              <p className="mono-label">Role-Based Experience</p>
            </div>

            <h3 className="text-2xl font-bold mb-6">Choose your path</h3>

            <div className="space-y-4">
              {/* HR Benefits */}
              <motion.div 
                className={`rounded-2xl p-5 border-2 transition-all ${
                  role === "HR" 
                    ? "border-(--accent)/50 bg-linear-to-br from-(--accent)/10 to-transparent" 
                    : "border-white/10 bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-(--accent)" />
                  </div>
                  <div>
                    <p className="font-bold text-white">HR / Recruiter</p>
                    <p className="text-xs text-gray-400">Full recruitment suite</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>AI-powered resume parsing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Semantic candidate search</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Pipeline management & automation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>AI assistant for queries</span>
                  </li>
                </ul>
              </motion.div>

              {/* Candidate Benefits */}
              <motion.div 
                className={`rounded-2xl p-5 border-2 transition-all ${
                  role === "CANDIDATE" 
                    ? "border-(--accent)/50 bg-linear-to-br from-(--accent)/10 to-transparent" 
                    : "border-white/10 bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-(--accent)" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Candidate</p>
                    <p className="text-xs text-gray-400">Job seeker portal</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Track application status</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Manage your resume</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Update profile & preferences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
                    <span>Interview scheduling</span>
                  </li>
                </ul>
              </motion.div>
            </div>

            <div className="divider-line my-6" />

            <div className="rounded-xl bg-linear-to-br from-(--accent)/10 to-transparent border border-(--accent)/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-(--accent)" />
                <p className="text-sm font-semibold text-white">Enterprise Security</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                SOC2 compliant with encrypted data storage and role-based access control
              </p>
            </div>
          </motion.aside>
        </div>

        {/* Footer */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-(--accent) hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <span>·</span>
            <a href="mailto:hello@vectorhire.ai" className="hover:text-white transition">Support</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
