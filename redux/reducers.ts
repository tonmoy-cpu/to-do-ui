import { createReducer } from "@reduxjs/toolkit";
import { addTask, deleteTask } from "./actions";

const initialState = {
  tasks: [],
  weather: null,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addTask, (state, action) => {
      state.tasks.push({ id: Date.now(), title: action.payload });
    })
    .addCase(deleteTask, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    })
    .addCase("SET_WEATHER", (state, action) => {
      state.weather = action.payload;
    });
});

export default reducer;