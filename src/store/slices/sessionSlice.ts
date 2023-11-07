import { createSlice } from "@reduxjs/toolkit";

interface InitialState{
    key:{token:string, refresh_token:string}|null,
    businessId:number|null,
    staticBar:boolean
}

const initialState:InitialState = {
    key:null,
    businessId:null,
    staticBar:true
}

const sessionSlice = createSlice({
    initialState,
    name:"session",
    reducers:{
        setKeys:(state,action)=>({...state,key:action.payload}),
        setBusinessId:(state,action)=>({...state,businessId:action.payload}),
        changeStaticBar:(state)=>({...state,staticBar:!state.staticBar}),
    },
}
);

export const {setKeys, setBusinessId, changeStaticBar} = sessionSlice.actions;
export default sessionSlice.reducer