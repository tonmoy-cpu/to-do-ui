import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reducer from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["tasks", "auth", "weather"], // Persist all slices
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["ADD_TASK", "EDIT_TASK", "persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["tasks.reminder"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof store.dispatch;