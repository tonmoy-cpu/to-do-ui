"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, deleteTask } from "@/redux/actions";
import TaskOptions from "@/components/TaskOptions";

const TaskList = ({ activeTab }: { activeTab: string }) => {
  const tasks = useSelector((state: any) => state.tasks);
  const weather = useSelector((state: any) => state.weather);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only run this once on mount if tasks array is empty
    if (tasks.length === 0) {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      storedTasks.forEach((task: any) => {
        // Dispatch only if task isn't already in state (redundant with reducer check, but extra safety)
        if (!tasks.some((t: any) => t.id === task.id)) {
          dispatch(addTask(task));
        }
      });
    }
  }, [dispatch]); // Removed tasks from dependency array to prevent re-runs

  useEffect(() => {
    tasks.forEach((task: any) => {
      if (task.reminder && new Date(task.reminder) <= new Date()) {
        console.log(`Reminder: ${task.title}`);
        if (!document.hidden) {
          new Audio("/sounds/alert.mp3").play().catch((err) => console.error("Audio play failed:", err));
        }
      }
    });
  }, [tasks]);

  const filteredTasks = tasks.filter((task: any) => {
    if (activeTab === "inbox") return true;
    if (activeTab === "today") return new Date(task.reminder).toDateString() === new Date().toDateString();
    if (activeTab === "upcoming") return new Date(task.reminder) > new Date();
    if (activeTab === "important") return task.priority === "high";
    return false;
  });

  return (
    <ul>
      {filteredTasks.map((task: any) => (
        <li key={task.id} className={`flex justify-between items-center border-b p-2 task-${task.priority}`}>
          <div>
            <span>{task.title} ({task.category})</span>
            {task.category === "outdoor" && weather && weather.name === task.location && (
              <p>Weather: {weather.main.temp}°C, {weather.weather[0].description}</p>
            )}
            {task.reminder && <p>Due: {new Date(task.reminder).toLocaleString()}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <TaskOptions task={task} />
            <button onClick={() => dispatch(deleteTask(task.id))} className="text-red-500">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;