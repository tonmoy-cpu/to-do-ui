import { createReducer } from "@reduxjs/toolkit";
import { addTask, deleteTask, editTask, login, logout } from "./actions";
import { Task } from "@/types/task";
import { Weather } from "@/types/weather";

interface AppState {
  tasks: Task[];
  weather: { [location: string]: Weather };
  auth: { isAuthenticated: boolean };
}

const initialState: AppState = {
  tasks: [],
  weather: {},
  auth: { isAuthenticated: false },
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTask, (state, action) => {
      if (!state.tasks.some((task) => task.id === action.payload.id)) {
        state.tasks.push(action.payload);
      }
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    })
    .addCase(deleteTask, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    })
    .addCase(editTask, (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
        localStorage.setItem("tasks", JSON.stringify(state.tasks));
      }
    })
    .addCase(login, (state) => {
      state.auth.isAuthenticated = true;
    })
    .addCase(logout, (state) => {
      state.auth.isAuthenticated = false;
    })
    .addCase("SET_WEATHER", (state, action) => {
      const weather = action.payload;
      state.weather[weather.name] = weather;
    });
});

export default reducer;