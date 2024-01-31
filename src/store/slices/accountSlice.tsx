import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import query from '../../api/APIServices';
import { generateUrlParams } from "../../utils/helpers";


export type Account = {
	totalItems: number;
	currentPage: number;
	totalPages: number;
	items: Item[];
}

export type Item = {
	id: number;
	address: string;
	name: null | string;
	code: string;
	description: null | string;
	isActive: boolean;
	isBlocked: boolean;
	isPrivate: boolean;
	amount: number;
	createdAt: Date;
	issueEntity: IssueEntity;
	owner: CreatedBy | null;
	createdBy: CreatedBy;
}

export type CreatedBy = {
	fullName: string;
}

export type IssueEntity = {
	id: number;
	name: string;
	profileImage: ProfileImage;
	business: Business;
}

export type Business = {
	name: string;
}

export type ProfileImage = {
	id: number;
	url: string;
	hash: string;
}



export const fetchAccounts = createAsyncThunk(
	'init/accountStatus',
	async (param: Record<string, string | number | boolean | null>, thunkAPI) => {
		try {
			// Fetch data from the account endpoint
			const accountResponse = await query.get(`/account/${generateUrlParams(param)}`);
			const accounts = accountResponse.data;

			if (!accounts) {
				return [];
			}
			return accounts;
		} catch (error) {
			// Handle errors here
			console.error('Error fetching data:', error);
			throw error;
		}
	},
);

interface InitialState {
	loading: boolean;
	accounts: Account;
	id: number;
}

const initialState: InitialState = {
	loading: false,
	accounts: {
		totalItems: 0,
		currentPage: 0,
		totalPages: 0,
		items: []
	},
	id: 0,
};

const accountSlice = createSlice({
	initialState,
	name: 'accountState',
	reducers: {
		saveAccountId: (state, action) => {
			state.id = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAccounts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAccounts.fulfilled, (state, action) => {
				state.accounts = action.payload;
				state.loading = false;
			})
			.addCase(fetchAccounts.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default accountSlice.reducer;

export const { saveAccountId } = accountSlice.actions;




