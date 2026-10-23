// src/layouts/AppLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiGrid,
  FiTrendingUp,
  FiTrendingDown,
  FiSettings,
  FiLogOut,
  FiTag,
  FiTarget,
  FiList,
  FiBarChart2,
  FiFlag,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { logout } from "../store/authSlice";
import { toggleTheme } from "../store/uiSlice";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const userInitial = displayName[0]?.toUpperCase() || "U";
  const userEmail = user?.email || "user@expensetracker.com";

  const navLinks = [
    { to: "/dashboard", icon: <FiGrid />, label: "Dashboard" },
    { to: "/transactions", icon: <FiList />, label: "All Transactions" },
    { to: "/income", icon: <FiTrendingUp />, label: "Income" },
    { to: "/expense", icon: <FiTrendingDown />, label: "Expense" },
    { to: "/categories", icon: <FiTag />, label: "Categories" },
    { to: "/budgets", icon: <FiTarget />, label: "Budget Limits" },
    { to: "/goals", icon: <FiFlag />, label: "Savings Goals" },
    { to: "/analytics", icon: <FiBarChart2 />, label: "Analytics" },
    { to: "/settings", icon: <FiSettings />, label: "Settings" },
  ];

  // Determine current active page label for breadcrumb
  const currentNav = navLinks.find((item) => item.to === location.pathname);
  const currentTitle = currentNav?.label || "Overview";

  return (
    <div className="flex h-screen w-full bg-[var(--color-bg-base)] text-[var(--color-text-main)] overflow-hidden">
      {/* ==================================================================== */}
      {/* DESKTOP SIDEBAR (Semantic Theme Surface & Borders)                   */}
      {/* ==================================================================== */}
      <aside className="hidden md:flex md:flex-col w-64 h-full bg-[var(--color-surface)] border-r border-[var(--color-border)] p-4 fixed left-0 top-0 z-30 shadow-sm backdrop-blur-md">
        {/* Brand / Logo Header */}
        <div className="flex items-center gap-3 pb-4 mb-3 border-b border-[var(--color-border-subtle)]">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-hover)] text-[var(--color-primary-text)] flex items-center justify-center font-black text-lg shadow-md shadow-[var(--color-primary)]/20 shrink-0">
            ₹
          </div>
          <div className="min-w-0 flex-1">
            <Link to="/" className="block">
              <span className="text-base font-black tracking-tight text-[var(--color-text-main)]">
                Expense<span className="text-[var(--color-primary)]">Tracker</span>
              </span>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Live Cloud Sync
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 text-sm overflow-y-auto pr-1">
          {navLinks.map((item) => (
            <SidebarLink key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </SidebarLink>
          ))}
        </nav>

        {/* User Card & Footer Actions */}
        <div className="pt-3 mt-2 border-t border-[var(--color-border-subtle)] space-y-3">
          {/* User profile capsule */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]">
            <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--color-text-main)] truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                {userEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleThemeToggle}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] transition"
              title="Toggle theme"
            >
              {theme === "light" ? (
                <>
                  <FiMoon className="text-sm" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <FiSun className="text-sm text-[var(--color-primary)]" />
                  <span>Light</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition"
              title="Logout"
            >
              <FiLogOut className="text-base" />
            </button>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MAIN VIEWPORT                                                        */}
      {/* ==================================================================== */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] z-20 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu hamburger toggle */}
            <button
              className="md:hidden p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)]"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[var(--color-text-muted)] hidden sm:inline">
                ExpenseTracker
              </span>
              <span className="text-[var(--color-border)] hidden sm:inline">/</span>
              <span className="font-bold text-[var(--color-text-main)] text-sm">
                {currentTitle}
              </span>
            </div>
          </div>

          {/* Right Header Status & Quick Actions */}
          <div className="flex items-center gap-3">
            <Badge variant="primary" size="xs" dot className="hidden sm:inline-flex">
              Cloud Synced
            </Badge>

            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon className="text-sm" /> : <FiSun className="text-sm text-[var(--color-primary)]" />}
            </button>

            <div className="h-8 w-8 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-text)] flex items-center justify-center font-black text-xs shadow-sm">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex flex-col top-[57px]">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10 animate-fade-in"
              onClick={closeMobileMenu}
            />
            <nav className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-4 space-y-1.5 max-h-[calc(100vh-65px)] overflow-y-auto shadow-2xl">
              {navLinks.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </SidebarLink>
              ))}

              <div className="pt-3 mt-3 border-t border-[var(--color-border-subtle)]">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        "flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition-all duration-150 " +
        (isActive
          ? "bg-[var(--color-primary)] text-[var(--color-primary-text)] font-black shadow-md shadow-[var(--color-primary)]/20"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-primary)]")
      }
    >
      <span className="text-base">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}

export default AppLayout;
