// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

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
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const theme = useSelector((state) => state.ui.theme);
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  //  Navbar sirf public routes me
  const publicPaths = ["/", "/login", "/signup"];
  const showNavbar = publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Public pages navbar */}
      {showNavbar && <Navbar />}
 
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private App Layout (Sidebar + Protected pages) */}
        <Route
          path="/"
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
