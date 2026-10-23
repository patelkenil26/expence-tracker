// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiUserPlus, FiUser, FiMail, FiLock } from "react-icons/fi";
import { signupApi } from "../api/authApi";
import {
  setAuthLoading,
  setAuthError,
  setCredentials,
} from "../store/authSlice";
import Button from "../components/ui/Button";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    if (!name || !email || !password || !confirmPassword) {
      const msg = "Please fill all required fields.";
      dispatch(setAuthError(msg));
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      dispatch(setAuthError(msg));
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      dispatch(setAuthError(msg));
      toast.error(msg);
      return;
    }

    try {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));

      const res = await signupApi({ name, email, password });

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      toast.success("Welcome aboard! Account created successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err?.response?.data?.message ||
        "Signup failed. Please try again with different details.";
      dispatch(setAuthError(msg));
      toast.error(msg);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-[var(--color-bg-base)]">
      {/* Background ambient glow orb with active palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-gradient-to-tr from-[var(--color-primary)]/20 via-[var(--color-surface-elevated)]/30 to-transparent blur-[100px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center text-[var(--color-primary-text)] shadow-md shadow-[var(--color-primary)]/20">
            <FiUserPlus className="text-xl" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-1 text-center text-[var(--color-text-main)] tracking-tight">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] text-center mb-6">
          Start tracking your income, expenses, and savings goals in seconds.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser className="text-sm" />
              </span>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition"
                placeholder="Kenil Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="text-sm" />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1.5 uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="text-sm" />
              </span>
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-sm font-medium text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
            <span>Create Account</span>
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--color-primary)] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
