"use client";
import React, { useEffect, Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask, fetchWeather, toggleTaskCompletion } from "@/redux/actions";
import { RootState, AppDispatch } from "@/redux/store";
import TaskOptions from "@/components/TaskOptions";
import { Task } from "@/types/task";
import { Weather } from "@/types/weather";

interface TaskListProps {
  activeTab: string;
  pendingReminders: Set<string>;
  setPendingReminders: Dispatch<SetStateAction<Set<string>>>;
}

const TaskList: React.FC<TaskListProps> = ({ activeTab, pendingReminders, setPendingReminders }) => {
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
    const newReminders: string[] = [];
    tasks.forEach((task: Task) => {
      if (
        task.reminder &&
        new Date(task.reminder) <= new Date() &&
        !task.completed &&
        !pendingReminders.has(task.id)
      ) {
        console.log(`Reminder triggered for: ${task.title} with ID: ${task.id}`);
        newReminders.push(task.id);
      }
    });
    if (newReminders.length > 0) {
      setPendingReminders((prev) => {
        const updatedSet = new Set(prev);
        newReminders.forEach((id) => updatedSet.add(id));
        console.log("Updated pendingReminders:", Array.from(updatedSet));
        return updatedSet;
      });
    }
  }, [tasks, pendingReminders, setPendingReminders]);

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
                <span className="text-black dark:text-black">
                  {task.title} ({task.category})
                </span>
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