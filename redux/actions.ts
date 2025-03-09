import { createAction } from "@reduxjs/toolkit";
import weatherService from "@/services/weatherService";
import { Task } from "@/types/task";

export const addTask = createAction<Task>("ADD_TASK");
export const deleteTask = createAction<string>("DELETE_TASK");
export const editTask = createAction<Task>("EDIT_TASK");
export const login = createAction("LOGIN");
export const logout = createAction("LOGOUT");
export const toggleTaskCompletion = createAction<string>("TOGGLE_TASK_COMPLETION"); // New action

export const fetchWeather = (location = "London") => async (dispatch: any) => {
  try {
    const weather = await weatherService.getWeather(location);
    dispatch({ type: "SET_WEATHER", payload: weather });
  } catch (error) {
    console.error(`Failed to fetch weather for ${location}:`, error);
    dispatch({ type: "SET_WEATHER", payload: { name: location, error: true } });
  }
};