import { createSlice } from "@reduxjs/toolkit";

interface InitialState{
    key:{token:string, refresh_token:string}|null,
    businessId:number|null,
    staticBar:boolean
    userDetails:null
}

const initialState:InitialState = {
    key:null,
    businessId:null,
    staticBar:true,
    userDetails:null,
}

const sessionSlice = createSlice({
    initialState,
    name:"session",
    reducers:{
        setKeys:(state,action)=>({...state,key:action.payload}),
        setBusinessId:(state,action)=>({...state,businessId:action.payload}),
        changeStaticBar:(state)=>({...state,staticBar:!state.staticBar}),
        setUserDetails:(state,action)=>({...state,userDetails:action.payload}),
    },
}
);

export const {setKeys, setBusinessId, changeStaticBar} = sessionSlice.actions;
export default sessionSlice.reducer