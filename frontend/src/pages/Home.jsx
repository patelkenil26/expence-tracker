// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiLock,
  FiHeart,
} from "react-icons/fi";

function Home() {
  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 sm:px-6 lg:px-10 py-10 bg-slate-100 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <div className="grid gap-10 md:grid-cols-2 items-center">
          {/* Left: Text content */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full mb-4">
              <FiTrendingUp className="text-indigo-500" />
              <span>Personal Finance · Made Simple</span>
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900 dark:text-slate-50 leading-tight">
              Track every rupee.
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Build better money habits.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
              This Expense Tracker is a clean, fast and secure web application
              that helps you organize your{" "}
              <span className="font-semibold">
                daily expenses, income, budgets and financial goals
              </span>
              in one place. Real-time stats, charts and category-wise breakdown — everything at one dashboard.
            </p>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 mb-6">
              <div className="flex gap-2">
                <FiCheckCircle className="mt-1 text-emerald-500" />
                <p>
                  <span className="font-semibold">Smart dashboard:</span> view
                  balance, income, expenses and recent transactions on a single screen.
                </p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="mt-1 text-emerald-500" />
                <p>
                  <span className="font-semibold">Deep insights:</span> monthly,
                  category-wise and yearly analytics — like a personal financial report.
                </p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="mt-1 text-emerald-500" />
                <p>
                  <span className="font-semibold">Secure & private:</span> JWT-based authentication ensures every user’s data stays separate and safe.
                </p>
              </div>
              <div className="flex gap-2">
                <FiCheckCircle className="mt-1 text-emerald-500" />
                <p>
                  <span className="font-semibold">Professional UI:</span> fully
                  responsive design with light/dark themes — perfect for portfolio projects.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
              >
                <FiTrendingUp />
                <span>Get started – Free</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Already using it?
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Ideal for students, employees, freelancers & creators who want full control over their finances.
            </p>
          </div>

          {/* Right: Preview card */}
          <div className="md:justify-self-end w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 sm:p-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Dashboard Preview
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Total Balance
                  </p>
                  <p className="text-lg font-bold text-emerald-500 mt-1">
                    ₹24,500
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Income (this month)
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹40,000
                  </p>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Expense (this month)
                  </p>
                  <p className="text-lg font-bold text-rose-500 mt-1">
                    ₹15,500
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Category overview
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full w-1/2 bg-indigo-500" />
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    Food · Bills · Rent · Travel
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <FiLock />
                  <span>Your data is private</span>
                </span>
                <span>Built with MERN + Redux</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE GRID */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            Everything you need to manage your money
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            The app is designed for daily use — fast, distraction-free and insight-oriented. These features are useful in real life and look strong on a resume too.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Unified dashboard</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                View live balance, monthly totals, recent transactions and reminders — without switching screens.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Powerful filters</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Date range, category, amount range, income/expense toggle — quickly locate any transaction.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">Visual reports</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pie charts, bar charts and summary cards make spending patterns easy to understand at a glance.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            How it works
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                Step 1
              </p>
              <h3 className="text-sm font-semibold mb-1">Create your account</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Sign up within seconds. Secure login with JWT-based authentication — no unnecessary details required.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                Step 2
              </p>
              <h3 className="text-sm font-semibold mb-1">
                Add income & expenses
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Add transactions with type, category, date and notes — the app handles all calculations automatically.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                Step 3
              </p>
              <h3 className="text-sm font-semibold mb-1">
                Analyse & improve
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Use monthly summaries, category-wise breakdowns and yearly trends to improve your spending habits.
              </p>
            </div>
          </div>
        </section>

        {/* WHO IS IT FOR + TECH STRIP */}
        <section className="grid gap-6 md:grid-cols-[1.5fr,1fr] items-start">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Who is this for?
            </h2>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                • <span className="font-semibold">Students</span> who want to track pocket money, fees and hostel expenses.
              </li>
              <li>
                • <span className="font-semibold">Working professionals</span>
                who want a clear view of salary, bills, EMIs and savings.
              </li>
              <li>
                • <span className="font-semibold">Freelancers & creators</span>
                who deal with multiple income sources and irregular spending.
              </li>
              <li>
                • Developers who want to showcase{" "}
                <span className="font-semibold">
                  MERN + Redux + JWT + analytics
                </span>
                based full-stack project in their portfolio.
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 text-slate-100 dark:bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Built with modern stack
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-full bg-slate-800">
                MongoDB
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                Express.js
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                React + Vite
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                Node.js
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                Redux Toolkit
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                Tailwind CSS
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-800">
                JWT Auth
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              This landing page and the complete application are designed to be
              portfolio-ready for developers to showcase professionally.
            </p>
          </div>
        </section>

        {/* FAQ + FOOTER */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50">
            Frequently asked questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">
                Is this application multi-user?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Yes, every user has their own account. With JWT authentication,
                each user can access only their own data.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">
                Does it work well on mobile?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Absolutely — the layout is fully mobile-first and works smoothly
                on all screen sizes, from small phones to large desktops.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">
                Is this like a real production-grade product?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Yes — it includes proper authentication, CRUD operations,
                filters, analytics, charts and a Redux store built using
                production-level patterns.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-1">
                How should I mention this in my resume/portfolio?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                You can mention it as “Full-stack Expense Tracker (MERN)” with
                the features and tech stack. Explaining the flow in interviews
                makes a strong impression.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Expense Tracker · Personal project
          </span>
          <span className="inline-flex items-center gap-1">
            Designed & developed with
            <FiHeart className="text-rose-500" />
            using MERN & Redux Toolkit
          </span>
        </footer>
      </div>
    </div>
  );
}

export default Home;
