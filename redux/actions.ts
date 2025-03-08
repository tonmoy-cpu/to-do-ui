import { createAction } from "@reduxjs/toolkit";
import weatherService from "@/services/weatherService";

export const addTask = createAction("ADD_TASK");
export const deleteTask = createAction("DELETE_TASK");
export const editTask = createAction("EDIT_TASK");
export const login = createAction("LOGIN");
export const logout = createAction("LOGOUT");

export const fetchWeather = (location = "London") => async (dispatch) => {
  try {
    const weather = await weatherService.getWeather(location);
    dispatch({ type: "SET_WEATHER", payload: weather });
  } catch (error) {
    console.error("Failed to fetch weather:", error);
  }
};