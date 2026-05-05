// pages/Home.jsx
import Header from "../components/Header";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Receipt,
  BarChart3,
  Shield,
  Link as LinkIcon,
  Tag,
  LineChart,
  Star,
  Linkedin,
  Twitter,
  Instagram,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const phrases = useMemo(
    () => [
      "SpendFlow",
      "Manage with AI",
      "AI Powered Tracking",
      "Smart Expense Control",
      "Intelligent Budgeting",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (charIndex < phrases[index].length) {
        setDisplayedText((prev) => prev + phrases[index][charIndex]);
        setCharIndex((p) => p + 1);
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIndex((p) => (p + 1) % phrases.length);
          setDisplayedText("");
          setCharIndex(0);
        }, 2000);
      }
    }, 120);

    return () => clearInterval(typingInterval);
  }, [charIndex, index, phrases]);

  const features = useMemo(
    () => [
      {
        title: "AI Insights",
        desc: "Understand spending patterns and get personalized savings tips.",
        icon: Brain,
      },
      {
        title: "Smart Expense Tracking",
        desc: "Auto-import and categorize your transactions in real-time.",
        icon: Receipt,
      },
      {
        title: "Visual Dashboards",
        desc: "Beautiful charts to visualize budgets and cashflow at a glance.",
        icon: BarChart3,
      },
      {
        title: "Secure & Private",
        desc: "Bank-grade encryption and privacy by default.",
        icon: Shield,
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        title: "Connect Accounts",
        desc: "Securely link your bank and cards in seconds.",
        icon: LinkIcon,
      },
      {
        title: "AI Categorizes Expenses",
        desc: "Our models auto-classify and detect recurring patterns.",
        icon: Tag,
      },
      {
        title: "Get Insights",
        desc: "Actionable recommendations to save more, faster.",
        icon: LineChart,
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "This AI finally made my finances make sense. I cut monthly spending by 18% in the first month.",
        name: "Ava Thompson",
        role: "Freelance Designer",
        rating: 5,
      },
      {
        quote:
          "The categorization is spot on and the dashboards are gorgeous. Budgeting feels effortless.",
        name: "Marcus Lee",
        role: "Product Manager",
        rating: 5,
      },
      {
        quote:
          "I love the insights. It flagged duplicate subscriptions I forgot about — instant savings!",
        name: "Priya Patel",
        role: "Data Analyst",
        rating: 4,
      },
    ],
    []
  );

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden  bg-[#1B1F24] text-white">
      {/* Animated Background Blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-gradient-to-tr from-[#06b6d4]/30 via-[#3b82f6]/20 to-[#22d3ee]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-tr from-[#3b82f6]/20 via-[#06b6d4]/20 to-[#22d3ee]/20 blur-3xl animate-pulse [animation-duration:5s]" />
        <motion.div
          className="absolute top-1/3 left-10 h-24 w-24 rounded-2xl bg-white/6 backdrop-blur-md shadow-lg"
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 h-16 w-16 rounded-full bg-white/4 backdrop-blur-md shadow"
          animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-24">
          <motion.div
            className="w-full text-center md:w-1/2 md:text-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Take Control of Your Finances with{" "}
              <span
                className="relative inline-block min-w-[220px] border-r-2 border-cyan-400 pr-1 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent"
                style={{ whiteSpace: "pre" }}
              >
                {displayedText}
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-300 md:max-w-xl">
              Track, analyze, and optimize your expenses effortlessly with smart AI
              insights — beautiful dashboards and privacy-first design.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              {/* <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#06b6d4]/20 transition-transform duration-200 hover:scale-[1.03] hover:from-[#2563eb] hover:to-[#0891b2] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a> */}

              {/* <a
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-white/5 px-7 py-3 text-base font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/30 focus:ring-offset-2"
              >
                Watch Demo
              </a> */}
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative mx-auto max-w-lg rounded-2xl bg-white/5 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
              <div className="absolute -top-3 -right-3 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-3 py-1 text-xs font-semibold text-white shadow">
                Preview
              </div>

              <div className="space-y-4">
                {/* Dashboard Blocks */}
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded-full bg-[#06b6d4]/40" />
                  <div className="h-3 w-12 rounded-full bg-[#3b82f6]/30" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-xl bg-white/6 p-4 ring-1 ring-white/10">
                    <div className="mb-3 h-4 w-28 rounded bg-[#06b6d4]/30" />
                    <div className="flex items-end gap-1">
                      <div className="h-16 w-4 rounded bg-[#06b6d4]/60" />
                      <div className="h-10 w-4 rounded bg-[#3b82f6]/60" />
                      <div className="h-20 w-4 rounded bg-[#22d3ee]/60" />
                      <div className="h-12 w-4 rounded bg-[#06b6d4]/40" />
                      <div className="h-8 w-4 rounded bg-[#3b82f6]/40" />
                      <div className="h-14 w-4 rounded bg-[#22d3ee]/50" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/6 p-4 ring-1 ring-white/10">
                    <div className="mb-3 h-4 w-20 rounded bg-[#22d3ee]/30" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-[#22d3ee]/30" />
                      <div className="h-2 w-5/6 rounded bg-[#22d3ee]/25" />
                      <div className="h-2 w-4/6 rounded bg-[#22d3ee]/20" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white/6 p-4 ring-1 ring-white/10">
                  <div className="mb-3 h-4 w-24 rounded bg-[#3b82f6]/30" />
                  <div className="flex h-2 w-full overflow-hidden rounded bg-white/8">
                    <div className="h-full w-1/3 bg-[#3b82f6]/60" />
                    <div className="h-full w-1/4 bg-[#06b6d4]/50" />
                    <div className="h-full w-1/6 bg-[#22d3ee]/40" />
                    <div className="h-full flex-1 bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
          >
            Powerful features to master your money
          </motion.h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, desc, icon: Icon }, idx) => (
              <motion.div
                key={title}
                className="group rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-xl transition-transform hover:scale-[1.02]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: idx * 0.04 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#06b6d4] text-white shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
          >
            How it works
          </motion.h2>

          <div className="mt-8">
            <div className="relative mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
              {steps.map(({ title, desc, icon: Icon }, idx) => (
                <motion.div
                  key={title}
                  className="relative rounded-2xl bg-white/5 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#06b6d4] text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                      <p className="mt-2 text-sm text-slate-300">{desc}</p>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <>
                      <div className="hidden lg:block">
                        <div className="absolute right-[-14px] top-1/2 hidden h-[2px] w-6 -translate-y-1/2 rounded bg-gradient-to-r from-[#3b82f6]/50 to-[#06b6d4]/50 lg:block" />
                      </div>

                      <div className="lg:hidden">
                        <div className="absolute bottom-[-14px] left-1/2 h-6 w-[2px] -translate-x-1/2 rounded bg-gradient-to-b from-[#3b82f6]/50 to-[#06b6d4]/50" />
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <motion.h2
            className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
          >
            Loved by smart savers
          </motion.h2>

          <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl bg-white/5 p-8 text-center shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45 }}
              >
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[activeTestimonial].rating
                          ? "fill-amber-400 stroke-amber-400"
                          : "stroke-amber-400"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-5 text-lg text-slate-100">
                  “{testimonials[activeTestimonial].quote}”
                </p>

                <div className="mt-6 text-sm font-medium text-white">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-xs text-slate-400">
                  {testimonials[activeTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    i === activeTestimonial
                      ? "bg-[#06b6d4]"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] p-[1px] shadow-2xl">
            <div className="rounded-3xl bg-white/5 p-10 text-center backdrop-blur-xl">
              <motion.h3
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeInUp}
              >
                Start saving smarter today!
              </motion.h3>

              <p className="mx-auto mt-3 max-w-2xl text-slate-200">
                Join thousands using AI to track, analyze, and optimize spending.
              </p>

              <div className="mt-8">
                {/* <a
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] px-8 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2"
                >
                  Sign Up Free
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row">
          <div className="text-sm text-slate-300">
            © {new Date().getFullYear()} SpendFlow
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-5 text-sm">
            <a href="/about" className="text-slate-300 hover:text-white hover:underline">
              About
            </a>
            <a href="/pricing" className="text-slate-300 hover:text-white hover:underline">
              Pricing
            </a>
            <a href="/contact" className="text-slate-300 hover:text-white hover:underline">
              Contact
            </a>
            <a href="/privacy" className="text-slate-300 hover:text-white hover:underline">
              Privacy Policy
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-slate-300 hover:text-[#06b6d4]">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-slate-300 hover:text-[#06b6d4]">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-[#06b6d4]">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
