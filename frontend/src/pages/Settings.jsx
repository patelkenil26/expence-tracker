// src/pages/Settings.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSettings } from "react-icons/fi";
import toast from "react-hot-toast";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

import { updateProfileApi, changePasswordApi } from "../api/authApi";
import { setCredentials } from "../store/authSlice";

function Settings() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [profileForm, setProfileForm] = useState({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  // ===========================
  // ▶ UPDATE PROFILE
  // ===========================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoadingProfile(true);

      const res = await updateProfileApi(profileForm);

      dispatch(
        setCredentials({
          user: res.data.user,
          token: auth.token, // token same rahega
        })
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // ===========================
  // ▶ CHANGE PASSWORD
  // ===========================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setLoadingPassword(true);
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile information and account security."
        icon={<FiSettings />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profile card */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-2 dark:text-slate-300">
            Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Update your name and email address.
          </p>

          <form onSubmit={handleProfileSubmit} className="space-y-3 dark:text-slate-300">
            <TextInput
              label="Name"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Your name"
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              placeholder="you@example.com"
            />
            <Button type="submit" variant="primary" disabled={loadingProfile}>
              {loadingProfile ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Card>

        {/* Password card */}
        <Card className="p-4 sm:p-5">
          <h2 className="text-sm font-semibold mb-2 dark:text-slate-300">
            Change password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Use a strong password to keep your account secure.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-3 dark:text-slate-300">
            <TextInput
              label="Current password"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
            />
            <TextInput
              label="New password"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="At least 6 characters"
            />
            <TextInput
              label="Confirm new password"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
            />

            <Button type="submit" variant="primary" disabled={loadingPassword}>
              {loadingPassword ? "Updating..." : "Update password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
