"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, fetchWeather, toggleTaskCompletion } from "@/redux/actions";
import { RootState, AppDispatch } from "@/redux/store";
import TaskOptions from "@/components/TaskOptions";
import { Task } from "@/types/task";
import { Weather } from "@/types/weather";

const TaskList = ({ activeTab }: { activeTab: string }) => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const weather = useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (tasks.length === 0) {
      const storedTasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
      storedTasks.forEach((task) => {
        if (!tasks.some((t) => t.id === task.id)) {
          dispatch(addTask(task));
        }
      });
    }

    tasks.forEach((task: Task) => {
      if (task.category === "outdoor" && !weather[task.location]) {
        dispatch(fetchWeather(task.location));
      }
    });
  }, [dispatch, tasks, weather]);

  useEffect(() => {
    tasks.forEach((task: Task) => {
      if (task.reminder && new Date(task.reminder) <= new Date() && !task.completed) {
        console.log(`Reminder: ${task.title}`);
        if (!document.hidden) {
          const audio = new Audio("/sounds/alert.mp3");
          audio.play()
            .then(() => console.log(`Playing reminder for ${task.title}`))
            .catch((err) => console.error(`Failed to play audio for ${task.title}:`, err));
        }
      }
    });
  }, [tasks]);

  const filteredTasks = tasks.filter((task: Task) => {
    if (activeTab === "home" || activeTab === "inbox") return true;
    if (activeTab === "today") return task.reminder && new Date(task.reminder).toDateString() === new Date().toDateString();
    if (activeTab === "upcoming") return task.reminder && new Date(task.reminder) > new Date();
    if (activeTab === "important") return task.priority === "high";
    return false;
  });

  return (
    <ul>
      {filteredTasks.map((task: Task) => {
        const taskWeather: Weather | undefined = weather[task.location];
        return (
          <li
            key={task.id}
            className={`flex justify-between items-center border-b p-2 task-${task.priority} ${
              task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => dispatch(toggleTaskCompletion(task.id))}
                className="mr-2"
              />
              <div>
                <span>{task.title} ({task.category})</span>
                {task.category === "outdoor" && taskWeather && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {taskWeather.error
                      ? "Weather unavailable"
                      : `Weather: ${taskWeather.main.temp}°C, ${taskWeather.weather[0].description}`}
                  </p>
                )}
                {task.reminder && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(task.reminder).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TaskOptions task={task} />
              <button
                onClick={() => dispatch(deleteTask(task.id))}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TaskList;