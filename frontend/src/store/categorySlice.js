import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_CATEGORY_NAMES } from "../constants/categories";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setCategories(state, action) {
      state.list = action.payload || [];
    },
    setCategoryLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const selectMergedCategoryNames = (state) => {
  const custom = state.categories?.list?.map((cat) => cat.name).filter(Boolean) || [];
  return [...new Set([...DEFAULT_CATEGORY_NAMES, ...custom])];
};

export const { setCategories, setCategoryLoading } = categorySlice.actions;
export default categorySlice.reducer;
