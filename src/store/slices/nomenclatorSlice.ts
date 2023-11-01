import { createSlice } from '@reduxjs/toolkit';
import {
  PlanInterface,
  UserInterface,
  BusinessCategoryInterface,
  RolesInterface,
  CurrenciesInterface,
  BusinessInterface,
} from '../../interfaces/ServerInterfaces';
import { initSystem } from '../actions/global';

interface dataConfig {
  key: string;
  value: string;
}

interface InitialData {
  plans: PlanInterface[];
  businessCategory: Array<BusinessCategoryInterface>;
  userRoles: Array<RolesInterface>;
  currency: Array<CurrenciesInterface>;
  business: Array<BusinessInterface>;
  config: Array<dataConfig>;
}

const initialState: InitialData = {
  businessCategory: [],
  plans: [],
  userRoles: [],
  currency: [],
  config: [],
  business: [],
};

const nomenclatorSlice = createSlice({
  name: 'initialData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initSystem, (_, action) => ({
      businessCategory: action.payload.businessCategory,
      config: action.payload.config,
      currency: action.payload.currency,
      plans: action.payload.plans,
      userRoles: action.payload.userRoles,
      business: action.payload.business,
    }));
  },
});

export const {} = nomenclatorSlice.actions;
export default nomenclatorSlice.reducer;
