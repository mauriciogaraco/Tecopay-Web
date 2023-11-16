import { createSlice } from '@reduxjs/toolkit';

export const ticketSlice = createSlice({
	name: 'accountState',
	initialState: {
		items: [],
		id: null,
	},
	reducers: {
		saveAccount: (state, action) => {
			const items = action.payload;
			state.items = items;
		},
		saveAccountId: (state, action) => {
			const id = action.payload;
			state.id = id;
		},
	},
});

export const { saveAccount, saveAccountId } = ticketSlice.actions;

export default ticketSlice.reducer;
