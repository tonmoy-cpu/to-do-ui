import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reducer from "./reducers";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["tasks", "auth", "weather"], // Persist tasks, auth, and weather
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["ADD_TASK", "UPDATE_TASK", "persist/PERSIST", "persist/REHYDRATE"], // Replace EDIT_TASK with UPDATE_TASK
        ignoredPaths: ["tasks.reminder"], // Ignore non-serializable Date objects in reminders
      },
    }),
});

export const persistor = persistStore(store);

export default store;

// Update RootState to reflect the new state structure
export type RootState = ReturnType<typeof reducer>;
// Update AppDispatch type
export type AppDispatch = typeof store.dispatch;