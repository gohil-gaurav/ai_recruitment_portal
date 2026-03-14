"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { setUser } from "@/lib/auth";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  Briefcase, 
  User, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Zap,
  Shield
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAuthenticated(true);
    } catch (e) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (role) => {
    setUser({ email, role, name: email.split("@")[0] });
    const redirectTo = role === "HR" ? "/dashboard" : "/candidate-dashboard";
    router.push(redirectTo);
  };

  const handleDemoLogin = async (demoEmail, demoPassword, role) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser({ email: demoEmail, role, name: demoEmail.split("@")[0] });
      const redirectTo = role === "HR" ? "/dashboard" : "/candidate-dashboard";
      router.push(redirectTo);
    } catch (e) {
      setError("Demo login failed. Please try again.");
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
      <div className="aceternity-spotlight" style={{ top: 120, left: 120 }} aria-hidden />
      <div className="aceternity-spotlight" style={{ bottom: -60, right: 120 }} aria-hidden />

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
              <p className="text-xs text-gray-400">Sign in to continue</p>
            </div>
          </Link>
          <Link
            href="/signup"
            className="pill bg-white/10 border border-white/15 text-white hover:border-(--accent) animated-button text-sm"
          >
            Create account
          </Link>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          {/* Login Form Section */}
          <motion.section 
            className="glass-card rounded-3xl p-8 md:p-10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent)/10 border border-(--accent)/30 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
              <span className="text-xs text-(--accent) font-semibold uppercase tracking-wider">Secure Login</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-3">
              Welcome back
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Sign in to access your recruitment workspace
            </p>

            {!authenticated ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-(--accent)" />
                    Email Address
                  </label>
                  <div className="relative">
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

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-(--accent)" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

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
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    disabled={loading}
                    className="flex-1 rounded-full bg-(--accent) text-black font-bold text-base px-8 py-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg hover:shadow-[0_0_30px_rgba(198,243,107,0.3)]"
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <Link
                    href="/"
                    className="rounded-full border-2 border-white/20 text-white hover:border-white/40 transition-all text-base px-8 py-4 inline-flex items-center justify-center font-semibold hover:bg-white/5"
                  >
                    Back to Home
                  </Link>
                </div>

                {/* Demo Login Section */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-gray-400 mb-4 text-center uppercase tracking-wider font-semibold">
                    Quick Demo Access
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => handleDemoLogin("hr@demo.com", "demo123", "HR")}
                      disabled={loading}
                      className="group rounded-xl border border-(--accent)/30 bg-linear-to-br from-(--accent)/10 to-transparent p-4 hover:from-(--accent)/20 hover:border-(--accent)/50 transition-all disabled:opacity-60 text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-(--accent)/20 flex items-center justify-center group-hover:bg-(--accent)/30 transition">
                          <Briefcase className="w-5 h-5 text-(--accent)" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">HR Dashboard</p>
                          <p className="text-xs text-gray-400">Recruiter access</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-(--accent)">
                        <Zap className="w-3 h-3" />
                        <span>Quick Login</span>
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => handleDemoLogin("candidate@demo.com", "demo123", "CANDIDATE")}
                      disabled={loading}
                      className="group rounded-xl border border-(--accent)/30 bg-linear-to-br from-(--accent)/10 to-transparent p-4 hover:from-(--accent)/20 hover:border-(--accent)/50 transition-all disabled:opacity-60 text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-(--accent)/20 flex items-center justify-center group-hover:bg-(--accent)/30 transition">
                          <User className="w-5 h-5 text-(--accent)" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Candidate Portal</p>
                          <p className="text-xs text-gray-400">Job seeker access</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-(--accent)">
                        <Zap className="w-3 h-3" />
                        <span>Quick Login</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </form>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Success Message */}
                <div className="rounded-2xl border border-(--accent)/30 bg-linear-to-br from-(--accent)/10 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-(--accent)" />
                    <p className="text-lg font-bold text-white">Authentication Successful</p>
                  </div>
                  <p className="text-sm text-gray-300">Logged in as: <span className="font-semibold text-white">{email}</span></p>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <p className="text-sm text-gray-300 font-semibold">Choose your workspace:</p>
                  <div className="grid gap-4">
                    <motion.button
                      onClick={() => handleRoleSelection("HR")}
                      className="group rounded-2xl border-2 border-white/20 bg-linear-to-br from-white/5 to-transparent p-6 hover:border-(--accent) hover:from-(--accent)/10 transition-all text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Briefcase className="w-7 h-7 text-(--accent)" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xl font-bold text-white mb-1">HR / Recruiter Dashboard</p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            Access candidate database, upload resumes, AI search assistant, and manage hiring pipeline
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-(--accent) text-sm font-semibold">
                            <span>Continue to Dashboard</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleRoleSelection("CANDIDATE")}
                      className="group rounded-2xl border-2 border-white/20 bg-linear-to-br from-white/5 to-transparent p-6 hover:border-(--accent) hover:from-(--accent)/10 transition-all text-left"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <User className="w-7 h-7 text-(--accent)" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xl font-bold text-white mb-1">Candidate Portal</p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            View your applications, manage resume, track interview status, and update profile
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-(--accent) text-sm font-semibold">
                            <span>Continue to Portal</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAuthenticated(false);
                    setEmail("");
                    setPassword("");
                    setError("");
                  }}
                  className="w-full rounded-full border-2 border-white/20 text-white hover:border-white/40 transition-all text-sm px-6 py-3 font-semibold hover:bg-white/5"
                >
                  Sign in as different user
                </button>
              </motion.div>
            )}
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
              <p className="mono-label">Platform Benefits</p>
            </div>

            <h3 className="text-2xl font-bold mb-6">What you get access to</h3>

            <ul className="space-y-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "AI-Powered Resume Parsing",
                  desc: "Automatically extract and structure candidate data from resumes in seconds"
                },
                {
                  icon: Zap,
                  title: "Semantic Search Engine",
                  desc: "Find candidates by intent and context, not just keywords"
                },
                {
                  icon: Shield,
                  title: "Intelligent Pipeline Management",
                  desc: "Track candidates through stages with automated workflows and SLA alerts"
                }
              ].map((item, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-(--accent)/30 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-(--accent)" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">{item.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="divider-line my-6" />

            <div className="rounded-xl bg-linear-to-br from-(--accent)/10 to-transparent border border-(--accent)/30 p-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Enterprise-grade security with SOC2 compliance, encrypted data storage, and role-based access control
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
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-(--accent) hover:underline font-semibold">
              Sign up for free
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
