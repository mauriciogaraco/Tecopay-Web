import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';

export const fetchRole = createAsyncThunk(
	'init/fetchRoleStatus',
	async (thunkAPI) => {
		const response = await query.get('/user/myuser');
		return response.data;
	},
);
interface Role {
	id: number;
	fullName: string;
	email: string;
	issueEntityId: number;
	account: null | string; // Assuming 'account' can be a string or null
}

interface InitialState {
	loading: boolean;
	roles: Role[];
}

const initialState: InitialState = {
	loading: false,
	roles: [],
};

const initSlice = createSlice({
	initialState,
	name: 'init',
	reducers: {
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRole.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRole.fulfilled, (state, action) => {
				state.roles = action.payload;
				state.loading = false;
			})
			.addCase(fetchRole.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default initSlice.reducer;
