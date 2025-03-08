import { createAction } from "@reduxjs/toolkit";
import weatherService from "@/services/weatherService";

export const addTask = createAction<any>("ADD_TASK"); // Using 'any' for now; refine type as needed
export const deleteTask = createAction<number>("DELETE_TASK");
export const editTask = createAction<any>("EDIT_TASK");
export const login = createAction("LOGIN");
export const logout = createAction("LOGOUT");

export const fetchWeather = (location = "London") => async (dispatch: any) => {
  try {
    const weather = await weatherService.getWeather(location);
    dispatch({ type: "SET_WEATHER", payload: weather });
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    dispatch({ type: "SET_WEATHER", payload: null }); // Clear weather on error
  }
};