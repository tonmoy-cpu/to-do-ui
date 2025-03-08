import { createAction } from "@reduxjs/toolkit";
import weatherService from "@/services/weatherService";

export const addTask = createAction("ADD_TASK");
export const deleteTask = createAction("DELETE_TASK");
export const fetchWeather = () => async (dispatch) => {
  try {
    const weather = await weatherService.getWeather();
    dispatch({ type: "SET_WEATHER", payload: weather });
  } catch (error) {
    console.error("Failed to fetch weather:", error);
  }
};