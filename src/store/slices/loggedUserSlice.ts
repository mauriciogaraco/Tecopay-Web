import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';

export const fetchLoggedUser = createAsyncThunk(
	'init/loggedUserStatus',
	async (thunkAPI) => {
		const response = await query.getAuth('/user');
		return response.data;
	},
);

type Device = {
	id: number;
	name: string;
	macAddress: string;
	registeredAt: Date;
	ipAddress: string;
}

type Image = {
	src: string;
}

type LoggedUser = {
	id: number;
	username: string;
	email: string;
	lastLogin?: Date;
	isActive: boolean;
	isSuperAdmin: boolean;
	isEmailConfirmed: boolean;
	createdAt?: Date;
	firstName: string;
	lastName: string;
	phone: string;
	sex: string;
	birthdate: null;
	image?: Image;
	devices?: Device[];
	addresses?: any[];
}


interface InitialState {
	loading: boolean;
	user: LoggedUser;
}

const initialState: InitialState = {
	loading: false,
	user: {
		id: 0,
		username: '',
		email: '',
		isActive: false,
		isSuperAdmin: false,
		isEmailConfirmed: false,
		firstName: '',
		lastName: '',
		phone: '',
		sex: '',
		birthdate: null,
	},
};

const loggedUserSlice = createSlice({
	initialState,
	name: 'loggedUser',
	reducers: {
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLoggedUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchLoggedUser.fulfilled, (state, action) => {
				state.user = action.payload;
				state.loading = false;
			})
			.addCase(fetchLoggedUser.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default loggedUserSlice.reducer;
