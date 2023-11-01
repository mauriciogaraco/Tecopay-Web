import { createSlice } from "@reduxjs/toolkit";
import {
  UserInterface,
} from "../../interfaces/ServerInterfaces";
import { initSystem } from "../actions/global";

interface InitialInterface {
  user: UserInterface | null;
}

const initialState: InitialInterface = {
  user: null,
};

const initSlice = createSlice({
  initialState,
  name: "init",
  reducers: {
     
    //Users-------------------------------------------------------------------------------------------
    //setFullUser: (state, action) => ({ ...state, user: action.payload }),
    updateUserState: (state, action) => ({
      ...state,
      user: { ...state.user, ...action.payload },
    }), 
},
extraReducers:(builder)=>{
  builder
  .addCase(initSystem, (state, action)=>({user:action.payload.user}))
}
});

export const {
  updateUserState,
} = initSlice.actions;

export default initSlice.reducer;
