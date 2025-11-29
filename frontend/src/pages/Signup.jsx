// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiUserPlus } from "react-icons/fi";
import { signupApi } from "../api/authApi";
import {
  setAuthLoading,
  setAuthError,
  setCredentials,
} from "../store/authSlice";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

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

      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      const msg =
        err?.response?.data?.message ||
        "Signup failed. Please try again with a different email.";
      dispatch(setAuthError(msg));
      toast.error(msg);
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-center flex items-center justify-center gap-2">
          <FiUserPlus className="text-indigo-500" />
          <span className="dark:text-slate-300">Create an account</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Start tracking your income and expenses in one place.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-3 py-2 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border dark:text-slate-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 dark:text-slate-500 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border dark:text-slate-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border dark:text-slate-500 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-wait text-white text-sm font-medium px-4 py-2.5 transition"
          >
            <FiUserPlus />
            <span>{loading ? "Creating account..." : "Sign up"}</span>
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
