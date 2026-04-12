import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./authSlice";

// Use a noop storage on the server to avoid SSR errors (localStorage is browser-only)
const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: unknown) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required by redux-persist — ignore these action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
