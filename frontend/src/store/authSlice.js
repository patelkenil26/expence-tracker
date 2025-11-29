import { createSlice } from "@reduxjs/toolkit";

const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
  };
};

const initialState = {
  ...getInitialAuthState(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.error = null;

      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    setAuthError(state, action) {
      state.error = action.payload;
    },
    setAuthLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthError, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
