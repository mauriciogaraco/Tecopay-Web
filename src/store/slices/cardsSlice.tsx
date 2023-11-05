import { createSlice } from "@reduxjs/toolkit";

export const cardsSlice = createSlice({
  name: "cardsState",
  initialState: {
    Cards:[],
  },
  reducers: {
    
    saveCards: (state, action) => {
      const coc = action.payload
      state.Cards = coc;

    },
  },
});

export const { saveCards } =
  cardsSlice.actions;

export default cardsSlice.reducer;
