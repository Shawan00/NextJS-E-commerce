import { createSlice } from "@reduxjs/toolkit";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const initialState = {
  value: [] as BreadcrumbItem[],
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumb: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setBreadcrumb } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;