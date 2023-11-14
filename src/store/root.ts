import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import sessionSlice from "./slices/sessionSlice";
import nomenclatorSlice from "./slices/nomenclatorSlice";
import configurationsKeySlice from "./slices/configurationsKeySlice";
import initSlice from "./slices/initSlice";
import accountreducer from "./slices/accountSlice";
import CardReducer from "./slices/cardsSlice"
import EntityReducer from './slices/EntitySlice'
const persistConfig = { key: "root", storage, whitelist: ["session", 'account'] };

const rootReducer = combineReducers({
  session: sessionSlice,
  init:initSlice,
  nomenclator: nomenclatorSlice,
  configurationsKey:configurationsKeySlice,
  account: accountreducer,
  cards: CardReducer,
  Entity: EntityReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  middleware: (getDefaultMiddelware) =>
    getDefaultMiddelware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), 
  reducer: 
    persistedReducer



});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

