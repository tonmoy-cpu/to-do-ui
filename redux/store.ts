import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducers";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in actions (e.g., Date objects in reminders)
        ignoredActions: ["ADD_TASK", "EDIT_TASK"],
        ignoredPaths: ["tasks.reminder"],
      },
    }),
});

export default store;

// Optional: Export types for TypeScript usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;