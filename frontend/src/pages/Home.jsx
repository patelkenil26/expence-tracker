// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiPieChart,
  FiTarget,
  FiZap,
  FiStar,
} from "react-icons/fi";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

function Home() {
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth?.user && !!auth?.token;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      {/* Background ambient gradient glow orbs with active theme palette */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-surface-elevated)]/40 to-transparent blur-[110px] pointer-events-none -z-0" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-[var(--color-primary)]/10 blur-[90px] pointer-events-none -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* ================================================================= */}
        {/* HERO SECTION                                                      */}
        {/* ================================================================= */}
        <section className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-text-main)] text-xs font-bold tracking-wide shadow-sm">
              <FiZap className="text-[var(--color-primary)] animate-bounce" />
              <span>Smarter Personal Finance Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[var(--color-text-main)]">
              Master every rupee.
              <br />
              <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-text-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
                Build lasting wealth.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              An executive-grade personal finance workspace. Track real-time cash flow,
              set automated budget guardrails, manage multi-category expenses, and hit savings goals with effortless clarity.
            </p>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm font-medium text-[var(--color-text-main)] max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[var(--color-primary)] shrink-0 text-base" />
                <span>Real-time income & expense ledger</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[var(--color-primary)] shrink-0 text-base" />
                <span>Automated budget breach alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[var(--color-primary)] shrink-0 text-base" />
                <span>Monthly analytics & trend charts</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-[var(--color-primary)] shrink-0 text-base" />
                <span>100% Encrypted & Private storage</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="gradient" size="lg" className="shadow-lg shadow-[var(--color-primary)]/20">
                    <span>Open Dashboard</span>
                    <FiArrowRight className="text-base" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button variant="gradient" size="lg" className="shadow-lg shadow-[var(--color-primary)]/20">
                      <span>Get Started — It's Free</span>
                      <FiArrowRight className="text-base" />
                    </Button>
                  </Link>

                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      <span>Sign In to Account</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Trust Social Proof Bar */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-3 text-xs text-[var(--color-text-muted)]">
              <div className="flex text-[var(--color-primary)]">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-current" />
                ))}
              </div>
              <span>Trusted for personal budgeting & portfolio management</span>
            </div>
          </div>

          {/* Right Column: Live Interactive Mockup Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 shadow-2xl backdrop-blur-xl transition hover:shadow-[var(--color-primary)]/15">
              {/* Card top bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-[var(--color-primary)]" />
                  <span className="ml-2 text-xs font-bold text-[var(--color-text-main)]">
                    Live Finance Snapshot
                  </span>
                </div>
                <Badge variant="primary" size="xs" dot>
                  Sync Active
                </Badge>
              </div>

              {/* 3 Metric Capsules */}
              <div className="grid grid-cols-3 gap-2.5 my-5">
                <div className="p-3 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Balance
                  </p>
                  <p className="text-base sm:text-lg font-black text-[var(--color-text-main)] mt-1">
                    ₹68,450
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Inflow
                  </p>
                  <p className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    ₹95,000
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Spent
                  </p>
                  <p className="text-base sm:text-lg font-black text-rose-700 dark:text-rose-300 mt-1">
                    ₹26,550
                  </p>
                </div>
              </div>

              {/* Category Spending Bars */}
              <div className="space-y-3 mb-5 p-3.5 rounded-2xl bg-[var(--color-surface-elevated)]/60 border border-[var(--color-border)]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--color-text-main)]">Dining & Groceries</span>
                  <span className="text-[var(--color-text-muted)]">₹8,400 (32%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-bg-base)] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[32%]" />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold pt-1">
                  <span className="text-[var(--color-text-main)]">House Rent & Bills</span>
                  <span className="text-[var(--color-text-muted)]">₹14,500 (54%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--color-bg-base)] overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full w-[54%]" />
                </div>
              </div>

              {/* Bottom Transaction Feed */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Latest Entries
                </p>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-elevated)]/50 border border-[var(--color-border-subtle)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                      +
                    </span>
                    <div>
                      <p className="font-bold text-[var(--color-text-main)]">Freelance Project</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">Client Direct Deposit</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    +₹35,000
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-elevated)]/50 border border-[var(--color-border-subtle)] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                      -
                    </span>
                    <div>
                      <p className="font-bold text-[var(--color-text-main)]">Electricity Bill</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">Monthly Utility</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">
                    -₹2,150
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* STATS TICKER STRIP                                                */}
        {/* ================================================================= */}
        <section className="rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">
                ₹15M+
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Total Expenses Managed
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                25,000+
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Transactions Tracked
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">
                99.9%
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Cloud Availability
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-black text-[var(--color-text-main)]">
                100%
              </p>
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Data Privacy & Encryption
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* FEATURE HIGHLIGHTS                                                */}
        {/* ================================================================= */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text-main)]">
              Built for speed, clarity, and control
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Everything you need to manage your personal balance sheet without bloated spreadsheets.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3 hover:-translate-y-1 hover:border-[var(--color-primary)]/50 transition duration-200">
              <div className="h-12 w-12 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center text-xl font-bold border border-[var(--color-primary)]/30">
                <FiPieChart />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Visual Analytics
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Understand spending behavior with dynamic charts, category breakdown rings, and 30-day cash flow trends.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3 hover:-translate-y-1 hover:border-amber-400/40 transition duration-200">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center text-xl font-bold border border-amber-200/50 dark:border-amber-800/50">
                <FiTarget />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Budget Guardrails
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Set category limits (Food, Rent, Shopping) and receive instant proactive threshold warnings before overspending.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3 hover:-translate-y-1 hover:border-emerald-400/40 transition duration-200">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center text-xl font-bold border border-emerald-200/50 dark:border-emerald-800/50">
                <FiShield />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-main)]">
                Zero-Leak Privacy
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Secure JWT authentication with isolated database collections ensures nobody else can ever inspect your finances.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
