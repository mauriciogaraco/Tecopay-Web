import { createSlice } from "@reduxjs/toolkit";

export const ticketSlice = createSlice({
  name: "ticketState",
  initialState: {
    items:[],
    Contacto: { name: "", id: "" },
    Clasificacion: { name: "", id: "" },
  },
  reducers: {
    
    saveContactoSelection: (state, action) => {
      const { name, id } = action.payload;
      state.Contacto.name = name;
      state.Contacto.id = id;
    },
    saveClasificacionSelection: (state, action) => {
      const { name, id } = action.payload;
      state.Clasificacion.name = name;
      state.Clasificacion.id = id;
    },
    saveItems: (state, action) => {
      const coc = action.payload
      state.items = coc;

    },
  },
});

export const { saveClasificacionSelection, saveContactoSelection, saveItems } =
  ticketSlice.actions;

export default ticketSlice.reducer;

export const selectItems = (state: any) => state.ticketState.items
