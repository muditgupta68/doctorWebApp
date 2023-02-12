import { createSlice } from "@reduxjs/toolkit";

const initialState = { loading: false };

export const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = alertSlice.actions;
