import { createSlice } from "@reduxjs/toolkit";

export const entitySlice = createSlice({
  name: "entityState",
  initialState: {
    Entity:[],
  },
  reducers: {
    
    saveEntity: (state, action) => {
      const coc = action.payload
      state.Entity = coc;

    },
  },
});

export const { saveEntity } =
  entitySlice.actions;

export default entitySlice.reducer;
