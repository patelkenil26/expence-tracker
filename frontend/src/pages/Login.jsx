// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { loginApi } from "../api/authApi";
import {
  setAuthLoading,
  setAuthError,
  setCredentials,
} from "../store/authSlice";
import Button from "../components/ui/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { loading, error } = auth;

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (auth?.user && auth?.token) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      const msg = "Please enter email and password.";
      dispatch(setAuthError(msg));
      toast.error(msg);
      return;
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      const res = await loginApi({ email, password });

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      dispatch(setAuthError(msg));
      toast.error(msg);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-[var(--color-bg-base)]">
      {/* Background ambient glow orb with active palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-surface-elevated)]/30 to-transparent blur-[100px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-[var(--color-primary-text)] shadow-md shadow-[var(--color-primary)]/20">
            <FiLogIn className="text-xl" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-1 text-center text-[var(--color-text-main)] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] text-center mb-6">
          Sign in to your account to manage your expenses and budgets.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail className="text-sm" />
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[var(--color-text-main)] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="text-sm" />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="md"
            loading={loading}
            className="w-full mt-2 py-3 shadow-md shadow-[var(--color-primary)]/20"
          >
            <span>Sign In</span>
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-[var(--color-primary)] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
