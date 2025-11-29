// src/layouts/AppLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
} from "react-icons/fi";
import { logout } from "../store/authSlice";
import { toggleTheme } from "../store/uiSlice";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.ui.theme);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileMenuOpen(false); // close menu on logout (mobile)
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 fixed left-0 top-0 overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
            {user?.name ? user.name[0]?.toUpperCase() : "U"}
          </div>
          <div>
            <Link to={"/"}>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Expense Tracker
              </p>
            </Link>
            {/* <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {user?.name || user?.email || "User"}
            </p> */}
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          <SidebarLink to="/dashboard" icon={<FiGrid />}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/transactions" icon={<FiList />}>
            All Transactions
          </SidebarLink>
          <SidebarLink to="/income" icon={<FiTrendingUp />}>
            Income
          </SidebarLink>
          <SidebarLink to="/expense" icon={<FiTrendingDown />}>
            Expense
          </SidebarLink>
          <SidebarLink to="/categories" icon={<FiTag />}>
            Categories
          </SidebarLink>
          <SidebarLink to="/budgets" icon={<FiTarget />}>
            Budget
          </SidebarLink>
          <SidebarLink to="/goals" icon={<FiFlag />}>
            Goals
          </SidebarLink>
          <SidebarLink to="/analytics" icon={<FiBarChart2 />}>
            Analytics
          </SidebarLink>
          <SidebarLink to="/settings" icon={<FiSettings />}>
            Settings
          </SidebarLink>
        </nav>

        <div className="mt-4 flex flex-col gap-2 pb-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-xs"
            onClick={handleThemeToggle}
          >
            {theme === "light" ? "Switch to dark" : "Switch to light"}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center text-xs"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-1" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Right side content */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-full overflow-hidden">
        {/* Top bar (Mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div>
            <Link to={"/"}>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Expense Tracker
              </p>
            </Link>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {user?.name || user?.email || "User"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ yaha light/dark toggle dikhayenge */}
            <Button
              variant="outline"
              className="text-xs px-3 py-1"
              onClick={handleThemeToggle}
            >
              {theme === "light" ? "Dark" : "Light"}
            </Button>

            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <FiX className="text-lg" />
              ) : (
                <FiMenu className="text-lg" />
              )}
            </Button>
          </div>
        </header>

        {/* Mobile navigation menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-2 space-y-1">
            <SidebarLink
              to="/dashboard"
              icon={<FiGrid />}
              onClick={closeMobileMenu}
            >
              Dashboard
            </SidebarLink>
            <SidebarLink
              to="/transactions"
              icon={<FiList />}
              onClick={closeMobileMenu}
            >
              All Transactions
            </SidebarLink>
            <SidebarLink
              to="/income"
              icon={<FiTrendingUp />}
              onClick={closeMobileMenu}
            >
              Income
            </SidebarLink>
            <SidebarLink
              to="/expense"
              icon={<FiTrendingDown />}
              onClick={closeMobileMenu}
            >
              Expense
            </SidebarLink>
            <SidebarLink
              to="/categories"
              icon={<FiTag />}
              onClick={closeMobileMenu}
            >
              Categories
            </SidebarLink>
            <SidebarLink
              to="/budgets"
              icon={<FiTarget />}
              onClick={closeMobileMenu}
            >
              Budget
            </SidebarLink>
            <SidebarLink
              to="/goals"
              icon={<FiFlag />}
              onClick={closeMobileMenu}
            >
              Goals
            </SidebarLink>
            <SidebarLink
              to="/analytics"
              icon={<FiBarChart2 />}
              onClick={closeMobileMenu}
            >
              Analytics
            </SidebarLink>
            <SidebarLink
              to="/settings"
              icon={<FiSettings />}
              onClick={closeMobileMenu}
            >
              Settings
            </SidebarLink>

            <div className="pt-2 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-center text-xs"
                onClick={handleLogout}
              >
                <FiLogOut className="mr-1" />
                Logout
              </Button>
            </div>
          </nav>
        )}

        {/* Outlet content scrolls */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5">
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
        "flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-slate-600 dark:text-slate-300 text-sm " +
        (isActive
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
          : "hover:bg-slate-100 dark:hover:bg-slate-900")
      }
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
}

export default AppLayout;
