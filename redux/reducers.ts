import { createReducer } from "@reduxjs/toolkit";
import { addTask, deleteTask, editTask, login, logout } from "./actions";

const initialState = {
  tasks: [],
  weather: null,
  auth: { isAuthenticated: false },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTask, (state, action) => {
      state.tasks.push(action.payload);
    })
    .addCase(deleteTask, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    })
    .addCase(editTask, (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) state.tasks[index] = action.payload;
    })
    .addCase(login, (state) => {
      state.auth.isAuthenticated = true;
    })
    .addCase(logout, (state) => {
      state.auth.isAuthenticated = false;
    })
    .addCase("SET_WEATHER", (state, action) => {
      state.weather = action.payload;
    });
});

export default reducer;