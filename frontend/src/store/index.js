import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import categorieReducer from "./categorySlice"
import budgetReducer from "./budgetsSlice"

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    categories : categorieReducer,
    budgets : budgetReducer
  },
});

export default store;
