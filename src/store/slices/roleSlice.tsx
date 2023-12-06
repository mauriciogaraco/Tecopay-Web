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
	name: string;
	code: string;
}

interface Roles {
	loading: boolean;
	roles: {
		id: number;
		fullName: string;
		email: string;
		issueEntityId: null;
		account: null;
		issueEntity: null;
		roles: Role[];
	};
}

interface InitialState {
	loading: boolean;
	roles: Roles[];
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
