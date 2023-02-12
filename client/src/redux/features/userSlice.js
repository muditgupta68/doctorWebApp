import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload;
    },
    setUserNull : (state)=>{
      state.user = null;
    }
  },
});

export const { setUser,setUserNull } = userSlice.actions;
