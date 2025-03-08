"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask } from "@/redux/actions";
import TaskOptions from "@/components/TaskOptions";

const TaskList = ({ activeTab }) => {
  const tasks = useSelector((state) => state.tasks);
  const weather = useSelector((state) => state.weather);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    storedTasks.forEach((task) => dispatch(addTask(task)));
  }, [dispatch]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.reminder && new Date(task.reminder) <= new Date()) {
        console.log(`Reminder: ${task.title}`); // Mock email
        if (document.hidden) return; // Check if tab is active
        new Audio("/sounds/alert.mp3").play();
      }
    });
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "inbox") return true;
    if (activeTab === "today") return new Date(task.reminder).toDateString() === new Date().toDateString();
    if (activeTab === "upcoming") return new Date(task.reminder) > new Date();
    if (activeTab === "important") return task.priority === "high";
    return false;
  });

  return (
    <ul>
      {filteredTasks.map((task) => (
        <li key={task.id} className={`flex justify-between items-center border-b p-2 task-${task.priority}`}>
          <div>
            <span>{task.title} ({task.category})</span>
            {task.category === "outdoor" && weather && weather.name === task.location && <p>Weather: {weather.main.temp}°C, {weather.weather[0].description}</p>}
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