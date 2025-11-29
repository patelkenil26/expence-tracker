import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setCategories(state, action) {
      state.list = action.payload;
    },
    setCategoryLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const selectMergedCategoryNames = (state) => {
  const defaults = [
    "Salary",
    "Freelance",
    "Business",
    "Food",
    "Travel",
    "Rent",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Other",
  ];

  const custom = state.categories?.list?.map((cat) => cat.name) || [];
  return [...new Set([...defaults, ...custom])];
};

export const { setCategories, setCategoryLoading } = categorySlice.actions;
export default categorySlice.reducer;
