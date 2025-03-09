"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, fetchWeather, toggleTaskCompletion } from "@/redux/actions";
import { RootState, AppDispatch } from "@/redux/store";
import TaskOptions from "@/components/TaskOptions";
import { Task } from "@/types/task";
import { Weather } from "@/types/weather";
import { cn } from "@/lib/utils";

const TaskList = ({ activeTab }: { activeTab: string }) => {
  const tasks = useSelector((state: RootState) => state.tasks);
  const weather = useSelector((state: RootState) => state.weather);
  const dispatch = useDispatch<AppDispatch>();

  // State to track reminders that need to show a toast
  const [pendingReminders, setPendingReminders] = useState<Set<string>>(new Set());

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
  }, [tasks, pendingReminders]);

  useEffect(() => {
    tasks.forEach((task: Task) => {
      if (task.category === "outdoor" && !weather[task.location]) {
        dispatch(fetchWeather(task.location));
      }
    });
  }, [dispatch, tasks, weather]);

  // Function to play the audio after user interaction
  const playReminderSound = (taskTitle: string) => {
    const audio = new Audio("/sounds/alert.mp3");
    audio.onerror = () => {
      console.error(`Failed to load audio for ${taskTitle}: File may be missing or unsupported. Ensure 'alert.mp3' is in public/sounds/`);
    };
    audio.onloadeddata = () => {
      audio
        .play()
        .then(() => console.log(`Playing reminder for ${taskTitle}`))
        .catch((err) => console.error(`Failed to play audio for ${taskTitle}:`, err));
    };
  };

  // Function to dismiss a reminder
  const dismissReminder = (taskId: string) => {
    setPendingReminders((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(taskId);
      console.log("Dismissed reminder, updated pendingReminders:", Array.from(updatedSet));
      return updatedSet;
    });
  };

  const getTaskById = (taskId: string) => tasks.find((task) => task.id === taskId);

  const filteredTasks = tasks.filter((task: Task) => {
    if (activeTab === "home" || activeTab === "inbox") return true;
    if (activeTab === "today") return task.reminder && new Date(task.reminder).toDateString() === new Date().toDateString();
    if (activeTab === "upcoming") return task.reminder && new Date(task.reminder) > new Date();
    if (activeTab === "important") return task.priority === "high";
    return false;
  });

  return (
    <div className="relative">
      {/* Toast Notifications for Reminders */}
      {pendingReminders.size > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {Array.from(pendingReminders).map((taskId) => {
            const task = getTaskById(taskId);
            if (!task) return null;
            return (
              <div
                key={task.id}
                className="bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#78909c] rounded-lg shadow-lg p-4 flex items-center justify-between max-w-sm"
              >
                <div>
                  <p className="text-sm font-medium text-[#1b281b] dark:text-white">
                    Reminder: {task.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-white">
                    Due: {task.reminder ? new Date(task.reminder).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      playReminderSound(task.title);
                      dismissReminder(task.id);
                    }}
                    className="text-[#3f9142] hover:text-[#357937]"
                  >
                    Play Sound
                  </button>
                  <button
                    onClick={() => dismissReminder(task.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task List */}
      <ul>
        {filteredTasks.map((task: Task) => {
          const taskWeather: Weather | undefined = weather[task.location];
          return (
            <li
              key={task.id}
              className={cn(
                "flex justify-between items-center border-b p-2",
                `task-${task.priority}`,
                task.completed && "line-through opacity-60"
              )}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => dispatch(toggleTaskCompletion(task.id))}
                  className="mr-2"
                />
                <div>
                  <span className={cn("text-black dark:text-black")}>{task.title} ({task.category})</span>
                  {task.category === "outdoor" && taskWeather && (
                    <p className={cn("text-sm text-gray-700 dark:text-gray-700")}>
                      {taskWeather.error
                        ? "Weather unavailable"
                        : `Weather: ${taskWeather.main.temp}°C, ${taskWeather.weather[0].description}`}
                    </p>
                  )}
                  {task.reminder && (
                    <p className={cn("text-sm text-gray-700 dark:text-gray-700")}>
                      Due: {new Date(task.reminder).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <TaskOptions task={task} />
                <button onClick={() => dispatch(deleteTask(task.id))} className="text-red-500 dark:text-red-300">
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskList;