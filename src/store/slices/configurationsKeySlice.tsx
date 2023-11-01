import { createSlice } from "@reduxjs/toolkit";
import {ConfigurationInterface} from "../../interfaces/ServerInterfaces";

interface InitialInterface {
    configurationsKey: ConfigurationInterface []| null;
}

const initialState: InitialInterface = {
    configurationsKey: [],
};

const configurationKeysSlice = createSlice({
        initialState,
        name:"configuarationsKey",
        reducers:{
            setConfigurationKey: (state,action) => {
                state.configurationsKey =action.payload
            },
        },
    }
);

export const {setConfigurationKey} = configurationKeysSlice.actions;
export default configurationKeysSlice.reducer
