// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/uiSlice";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";

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
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur dark:text-slate-300 shadow-sm px-4 sm:px-6 py-3 flex justify-between items-center">
      {/* Left side: logo + dashboard link (if logged in) */}
      <div className="flex items-center gap-4">
        <Link to="/" className="font-semibold">
          Expense Tracker
        </Link>

        {isAuthenticated && (
          <Link
            to="/dashboard"
            className="text-xs sm:text-sm px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Right side: theme + auth controls */}
      <div className="flex items-center gap-3 text-sm">
        {/* Theme Switch */}
        <button
          onClick={handleThemeToggle}
          className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm flex items-center justify-center"
        >
          {theme === "light" ? <MdLightMode /> : <MdOutlineLightMode />}
        </button>

        {/* Auth UI */}
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="hover:underline text-xs sm:text-sm">
              Login
            </Link>
            <Link to="/signup" className="hover:underline text-xs sm:text-sm">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="text-[11px] sm:text-xs px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
