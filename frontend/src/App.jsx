// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { applyThemeVariables } from "./constants/theme";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Settings from "./pages/Settings";

import Navbar from "./components/Navbar";
import AppLayout from "./layouts/AppLayout";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";

function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  if (!auth?.user || !auth?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const theme = useSelector((state) => state.ui.theme);
  const location = useLocation();

  useEffect(() => {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    applyThemeVariables(isDark);
  }, [theme]);

  // Navbar only on public routes
  const publicPaths = ["/", "/login", "/signup"];
  const showNavbar = publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors">
      {/* Public pages navbar */}
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private App Layout (Sidebar + Protected pages) using pathless layout route */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
