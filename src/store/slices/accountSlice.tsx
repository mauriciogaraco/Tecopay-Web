import { createSlice } from '@reduxjs/toolkit';

export const ticketSlice = createSlice({
	name: 'accountState',
	initialState: {
		items: [],
	},
	reducers: {
		saveItems: (state, action) => {
			const coc = action.payload;
			state.items = coc;
		},
	},
});

export const { saveItems } = ticketSlice.actions;

export default ticketSlice.reducer;

export const selectItems = (state: any) => state.ticketState.items;
