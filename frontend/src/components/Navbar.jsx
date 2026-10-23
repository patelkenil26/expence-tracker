// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/uiSlice";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";
import { FiSun, FiMoon, FiGrid, FiLogOut } from "react-icons/fi";
import Button from "./ui/Button";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state) => state.ui.theme);
  const auth = useSelector((state) => state.auth);
  const isAuthenticated = !!auth?.user && !!auth?.token;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="sticky top-0 z-40 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center transition-colors">
      {/* Left side: logo + dashboard link */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-[var(--color-primary-text)] shadow-md shadow-[var(--color-primary)]/20">
            <span className="font-black text-base">₹</span>
          </div>
          <span className="font-black text-[var(--color-text-main)] text-base sm:text-lg tracking-tight">
            Expense<span className="text-[var(--color-primary)]">Tracker</span>
          </span>
        </Link>

        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] transition"
          >
            <FiGrid className="text-xs" />
            <span>Dashboard</span>
          </Link>
        )}
      </div>

      {/* Right side: theme + auth controls */}
      <div className="flex items-center gap-3 text-sm">
        {/* Theme Switch */}
        <button
          id="public-theme-toggle"
          aria-label="Toggle theme"
          onClick={handleThemeToggle}
          className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-elevated)] transition cursor-pointer"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FiMoon className="text-base" /> : <FiSun className="text-base text-[var(--color-primary)]" />}
        </button>

        {/* Auth UI */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="gradient" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="sm:hidden">
              <Button variant="gradient" size="xs">
                Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 hover:border-rose-200"
            >
              <FiLogOut className="text-xs" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
