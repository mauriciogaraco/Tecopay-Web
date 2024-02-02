import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';

type Role = {
	id: number;
	fullName: string;
	email: string;
	issueEntityId: number;
	account: string;
	roles: RoleData[];
}

type RoleData = {
	id: number;
	name: string;
	code: string;
}

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
	loadingRole: boolean;
	role: Role;
	user: LoggedUser;
}

export const fetchLoggedUser = createAsyncThunk(
	'init/loggedUserStatus',
	async (thunkAPI) => {
		const response = await query.getAuth('/user');
		return response.data;
	},
);
export const fetchLoggedUserRole = createAsyncThunk(
	'init/loggedUserRole',
	async (thunkAPI) => {
		const response = await query.get('/user/myuser');
		return response.data;
	},
);

const initialState: InitialState = {
	loading: false,
	loadingRole: false,
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
	role: {
		id: 0,
		fullName: '',
		email: '',
		issueEntityId: 0,
		account: '',
		roles: [],
	}
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
			})
			.addCase(fetchLoggedUserRole.pending, (state) => {
				state.loadingRole = true;
			})
			.addCase(fetchLoggedUserRole.fulfilled, (state, action) => {
				state.role = action.payload;
				state.loadingRole = false;
			})
			.addCase(fetchLoggedUserRole.rejected, (state) => {
				state.loadingRole = false;
			});

	},


});

export default loggedUserSlice.reducer;
