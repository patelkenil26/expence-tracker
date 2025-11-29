// src/store/budgetsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],        // raw budgets: [{_id, category, amount, month, year}]
  progress: [],    // summary: [{category, budget, spent, percentage}]
  loading: false,
  error: null,
};

const budgetsSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudgets(state, action) {
      state.list = action.payload || [];
    },
    setBudgetProgress(state, action) {
      state.progress = action.payload || [];
    },
    setBudgetsLoading(state, action) {
      state.loading = action.payload;
    },
    setBudgetsError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setBudgets,
  setBudgetProgress,
  setBudgetsLoading,
  setBudgetsError,
} = budgetsSlice.actions;

export default budgetsSlice.reducer;
