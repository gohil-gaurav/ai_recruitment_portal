"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  FileText, 
  Search, 
  Database, 
  Target, 
  Zap,
  Upload,
  Bot,
  HardDrive,
  SearchCheck,
  BarChart3,
  Inbox,
  Star,
  MessageSquare,
  FileCheck,
  PartyPopper,
  Lock,
  Sparkles,
  Workflow
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Parsing",
    desc: "Magic UI extraction maps every skill, entity, and experience to structured data in seconds.",
    highlight: "99.8% accuracy"
  },
  {
    icon: Search,
    title: "AI Candidate Search",
    desc: "Semantic search across profiles, resumes, and interview notes. Find intent, not keywords.",
    highlight: "Sub-200ms queries"
  },
  {
    icon: Database,
    title: "Candidate Database",
    desc: "A living graph of talent with versioned profiles, enrichment, and smart clustering.",
    highlight: "Unlimited storage"
  },
  {
    icon: Target,
    title: "Duplicate Detection",
    desc: "Aceternity-grade matching collapses duplicates and merges history automatically.",
    highlight: "Zero false positives"
  },
  {
    icon: Zap,
    title: "Hiring Pipeline",
    desc: "Adaptive kanban with automations, SLA alerts, and stage-level analytics.",
    highlight: "Real-time sync"
  },
];

const workflow = [
  { step: "Resume Upload", icon: Upload, time: "< 1s" },
  { step: "AI Parsing", icon: Bot, time: "2-3s" },
  { step: "Candidate Database", icon: HardDrive, time: "Instant" },
  { step: "Smart Search", icon: SearchCheck, time: "< 200ms" },
  { step: "Hiring Pipeline", icon: BarChart3, time: "Real-time" },
];

const pipeline = [
  { stage: "Applied", count: "124", vibe: "glass-card", icon: Inbox },
  { stage: "Shortlisted", count: "38", vibe: "neon-border", icon: Star },
  { stage: "Interview", count: "12", vibe: "glass-card", icon: MessageSquare },
  { stage: "Offer", count: "5", vibe: "neon-border", icon: FileCheck },
  { stage: "Hired", count: "3", vibe: "glass-card", icon: PartyPopper },
];

const testimonials = [
  {
    name: "Maya Chen",
    role: "Head of Talent, Northwind",
    quote: "We replaced three tools and cut time-to-shortlist by 63%. The search feels psychic.",
    avatar: "MC"
  },
  {
    name: "Jonas Patel",
    role: "Founder, Alder Labs",
    quote: "Parsing is instant, dedupe is flawless, and the pipeline board looks gorgeous on a big screen.",
    avatar: "JP"
  },
];

const stats = [
  { value: "10K+", label: "Resumes Parsed" },
  { value: "99.8%", label: "Accuracy Rate" },
  { value: "< 200ms", label: "Search Speed" },
  { value: "24/7", label: "Uptime SLA" },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInFromTop = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

// Scroll animation component
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
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
      <div className="aceternity-spotlight" style={{ bottom: -40, right: 80 }} aria-hidden />

      {/* Navbar with fade in from top */}
      <motion.header 
        className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        variants={fadeInFromTop}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-11 h-11 rounded-xl neon-border flex items-center justify-center font-black text-lg bg-linear-to-br from-(--accent)/10 to-transparent">
            V
          </div>
          <div>
            <p className="font-bold text-base">VectorHire AI</p>
            <p className="text-xs text-gray-400">Precision recruiting</p>
          </div>
        </motion.div>
        <div className="flex items-center gap-3">
          <a href="#features" className="hidden sm:inline text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">Product</a>
          <a href="#demo" className="hidden sm:inline text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">Demo</a>
          <a href="#pricing" className="hidden sm:inline text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">Pricing</a>
          <Link
            href="/login"
            className="hidden sm:inline pill border border-white/15 text-sm text-white hover:border-(--accent) transition animated-button"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="pill bg-(--accent) text-black font-semibold animated-button text-sm"
          >
            Get Started
          </Link>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24 space-y-24">
        {/* Hero */}
        <section className="pt-16 pb-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-8">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 neon-border rounded-full text-xs uppercase tracking-wider text-(--muted) bg-white/5"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
              Powered by AI · Built for Scale
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              AI-powered hiring that feels{" "}
              <span className="text-(--accent) telepathic-glow inline-block">
                telepathic
              </span>
              .
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Parse resumes instantly, eliminate duplicates, search semantically, and manage candidates through an intelligent pipeline. Built for elite recruiting teams who demand precision.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/signup" className="pill bg-(--accent) text-black font-bold shadow-2xl animated-button text-base px-8 py-3">
                Start Free Trial
              </Link>
              <a
                href="#features"
                className="pill border border-white/20 text-white hover:border-white/40 animated-button text-base px-8 py-3 backdrop-blur-sm"
              >
                Explore Features
              </a>
            </motion.div>
            
            <motion.div 
              className="divider-line"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
            
            <motion.div 
              className="flex flex-wrap gap-8 text-sm"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {[
                { icon: Lock, text: "SOC2-ready data rooms" },
                { icon: Zap, text: "Semantic + vector search" },
                { icon: Workflow, text: "Pipeline automations" }
              ].map((item, idx) => (
                <motion.div 
                  key={item.text}
                  className="flex items-center gap-2.5 text-gray-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                >
                  <item.icon className="w-4 h-4 text-(--accent)" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Hero Demo Card with slide in from right and floating animation */}
          <motion.div 
            className="relative glass-card rounded-3xl p-8 overflow-hidden glow-outline hover-tilt floating-card"
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 magic-grid opacity-40" aria-hidden />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="mono-label text-xs">Live Demo</span>
                <span className="pill bg-(--accent)/20 text-(--accent) text-xs border border-(--accent)/30">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-(--accent) mr-1.5 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="space-y-4 text-sm">
                <motion.div 
                  className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-(--accent)/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Resume Upload</p>
                    <p className="font-semibold text-white">elena-rojas.pdf</p>
                    <p className="text-xs text-gray-500 mt-1">2.4 MB · PDF</p>
                  </div>
                  <span className="pill bg-(--accent) text-black font-semibold text-xs">Parsing</span>
                </motion.div>
                
                <motion.div 
                  className="p-5 rounded-2xl bg-linear-to-br from-white/5 to-white/0 border border-white/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <p className="text-xs text-gray-400 mb-2">AI-Generated Summary</p>
                  <p className="font-semibold text-white leading-relaxed">
                    Staff Data Engineer · Graph search · Vertex AI · Kubernetes · 7 yrs exp
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["Python", "ML", "Cloud"].map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-lg bg-(--accent)/10 text-(--accent) text-xs border border-(--accent)/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="shimmer-line h-px mt-4" />
                </motion.div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  {["Applied", "Interview", "Offer"].map((label, idx) => (
                    <motion.div 
                      key={label} 
                      className="rounded-xl bg-white/5 border border-white/10 py-4 hover:border-(--accent)/30 transition-colors"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ transitionDelay: `${1.4 + idx * 0.1}s` }}
                    >
                      <p className="text-xs text-gray-400 mb-1">Stage</p>
                      <p className="font-bold text-white">{label}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="p-5 rounded-2xl border border-white/10 bg-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                >
                  <p className="text-xs text-gray-400 mb-2">Vector Search Result</p>
                  <p className="font-semibold text-white">
                    &quot;Senior ML engineer fintech risk&quot;
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-(--accent) font-bold">12 matches</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400 text-xs">180ms</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <ScrollReveal>
          <section className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-black text-(--accent) mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Features with scroll animations */}
        <section id="features" className="space-y-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <p className="mono-label mb-3">Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Everything hiring needs, reimagined.
              </h2>
              <p className="text-lg text-gray-400">
                Built for recruiting ops teams who demand speed, accuracy, and intelligence.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.1}>
                <article className="glass-card rounded-2xl p-6 hover-tilt animated-card h-full group">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-(--accent)" />
                  </div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="pill bg-(--accent)/10 text-(--accent) text-xs border border-(--accent)/20">
                      {item.highlight}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="space-y-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <p className="mono-label mb-3">Workflow</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                How the hiring flow runs end-to-end.
              </h2>
              <p className="text-lg text-gray-400">
                From resume upload to hire in minutes, not weeks.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="glass-card rounded-3xl p-8">
              <div className="grid sm:grid-cols-5 gap-6">
                {workflow.map((item, idx) => (
                  <motion.div 
                    key={item.step} 
                    className="relative p-5 rounded-2xl bg-linear-to-br from-white/5 to-transparent border border-white/10 text-center hover:border-(--accent)/30 transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-(--accent)" />
                    </div>
                    <p className="mono-label mb-2 text-(--accent)">
                      {String(idx + 1).padStart(2, '0')}
                    </p>
                    <p className="font-bold text-white mb-2">{item.step}</p>
                    <p className="text-xs text-gray-500">{item.time}</p>
                    {idx < workflow.length - 1 && (
                      <span className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 text-(--accent) text-xl">
                        →
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Pipeline showcase */}
        <section className="space-y-8" id="demo">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <p className="mono-label mb-3">Pipeline</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Visual hiring pipeline with motion cues.
              </h2>
              <p className="text-lg text-gray-400">
                Track candidates in real-time with automated workflows and SLA alerts.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {pipeline.map((item, idx) => (
              <ScrollReveal key={item.stage} delay={idx * 0.1}>
                <motion.div 
                  className={`rounded-2xl p-6 text-center hover-tilt animated-card ${item.vibe} group`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-(--accent)" />
                  </div>
                  <p className="mono-label mb-2 text-gray-500">Stage</p>
                  <p className="text-2xl font-black mb-2">{item.stage}</p>
                  <div className="text-3xl font-black text-(--accent) mb-3">
                    {item.count}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Automations · SLA timers
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-10">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <p className="mono-label mb-3">Testimonials</p>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Teams shipping faster with VectorHire.
              </h2>
              <p className="text-lg text-gray-400">
                Join hundreds of recruiting teams who&apos;ve transformed their hiring process.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={t.name} delay={idx * 0.15}>
                <article className="glass-card rounded-2xl p-8 hover-tilt animated-card h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--accent)/20 to-(--accent)/5 border border-(--accent)/30 flex items-center justify-center font-bold text-(--accent)">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-sm text-gray-400">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-(--accent)">★</span>
                    ))}
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Pricing / CTA */}
        <ScrollReveal>
          <section id="pricing" className="glass-card rounded-3xl p-10 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 magic-grid opacity-30" aria-hidden />
            <div className="relative z-10 max-w-3xl mx-auto">
              <p className="mono-label mb-4">Get Started</p>
              <h3 className="text-4xl md:text-5xl font-black mb-4">
                From pilot to full rollout in days.
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Unlimited resume parsing in pilot · SOC2-ready · Dedicated onboarding
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/signup" 
                  className="pill bg-(--accent) text-black font-bold animated-button text-base px-10 py-4 shadow-2xl"
                >
                  Start Free Trial
                </Link>
                <a 
                  href="mailto:hello@vectorhire.ai" 
                  className="pill border border-white/20 text-white hover:border-white/40 transition text-base px-10 py-4 backdrop-blur-sm"
                >
                  Schedule Demo
                </a>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <footer className="border-t border-white/10 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl neon-border flex items-center justify-center font-black bg-linear-to-br from-(--accent)/10 to-transparent">
                  V
                </div>
                <div>
                  <p className="font-bold">VectorHire AI</p>
                  <p className="text-xs text-gray-500">Precision recruiting</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Futuristic recruiting for teams who care about craft. Built with AI, designed for humans.
              </p>
            </div>
            <div>
              <p className="font-bold mb-3 text-sm">Product</p>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#features" className="block hover:text-white transition">Features</a>
                <a href="#demo" className="block hover:text-white transition">Demo</a>
                <a href="#pricing" className="block hover:text-white transition">Pricing</a>
              </div>
            </div>
            <div>
              <p className="font-bold mb-3 text-sm">Company</p>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="mailto:hello@vectorhire.ai" className="block hover:text-white transition">Contact</a>
                <a href="#" className="block hover:text-white transition">Privacy</a>
                <a href="#" className="block hover:text-white transition">Terms</a>
              </div>
            </div>
          </div>
          <div className="divider-line mb-6" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 VectorHire AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
