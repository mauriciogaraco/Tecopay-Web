import { createSlice } from "@reduxjs/toolkit";
import {

  BusinessInterface,
  UserInterface,
} from "../../interfaces/ServerInterfaces";
import { changeBusiness, initSystem } from "../actions/global";
import { ConfigUpdate } from "../../interfaces/Interfaces";


interface RolesStateInterface {
  isOwner: boolean;
  isAdmin: boolean;
  isManagerArea: boolean;
  isProcesator: boolean;
  isEcoCycleManager: boolean;
  isManagerContability: boolean;
  isProductionAllowed: boolean;
  isManagerShopOnline: boolean;
}

interface InitialInterface {
  business: BusinessInterface | null;
  user: any;
  roles: RolesStateInterface | null;
  branches: any[];
  loading: boolean;
}

const initialState: InitialInterface = {
  business: null,
  user: null,
  roles: null,
  branches: [],
  loading: false,
};

const initSlice = createSlice({
  initialState,
  name: "init",
  reducers: {
    //Business --------------------------------------------------------------------------------------
   
    //Users--------------------------------------------------------------------------------------
    setFullUser: (state, action) => ({ ...state, user: action.payload }),
    updateUser: (state, action) => ({
      ...state,
      user: { ...state.user, ...action.payload },
    }),
    //Branches ---------------------------------------------------------------------------------------
    setBranches: (state, action) => ({ ...state, branches: action.payload }),
  },
  extraReducers(builder) {
    builder
      .addCase(initSystem, (state, action) => {
        const user: UserInterface = action.payload.user;
        const roles: RolesStateInterface = {
          isOwner: user?.roles.some((item) =>
            ["GROUP_OWNER", "OWNER"].includes(item.code)
          ),
          isAdmin: user?.roles.some((item) => item.code === "ADMIN"),
          isManagerArea: user?.roles.some(
            (item) => item.code === "MANAGER_AREA"
          ),
          isProcesator: user?.roles.some(
            (item) => item.code === "PRODUCT_PROCESATOR"
          ),
          isEcoCycleManager: user?.roles.some(
            (item) => item.code === "MANAGER_ECONOMIC_CYCLE"
          ),
          isManagerContability: user?.roles.some(
            (item) => item.code === "MANAGER_CONTABILITY"
          ),
          isProductionAllowed: user?.roles.some(
            (item) =>item.code === "CHIEF_PRODUCTION"
          ),
          isManagerShopOnline: user?.roles.some(
            (item) => item.code === "MANAGER_SHOP_ONLINE"
          ),
        };
        return {
          ...state,
          user,
          roles,
          branches: action.payload.branches,
        };
      })
     
  },
});

export const {
  setBranches,
  setFullUser,
  updateUser,
} = initSlice.actions;

export default initSlice.reducer;
