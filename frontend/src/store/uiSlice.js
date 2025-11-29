import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  //system preference
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme:dark)").matches;

  return prefersDark ? "dark" : "light";
};

const initialState = {
  theme: getInitialTheme(), //light dark
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
    },

    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;