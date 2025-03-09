"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, fetchWeather } from "@/redux/actions";
import { AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";

const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const TaskInput = ({ onClose }: { onClose: () => void }) => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState<"indoor" | "outdoor">("indoor");
  const [location, setLocation] = useState("London");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [reminder, setReminder] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      const newTask: Task = {
        id: generateUniqueId(),
        title: task,
        category,
        location,
        priority,
        reminder: reminder ? new Date(reminder).toISOString() : null,
      };
      dispatch(addTask(newTask));
      if (category === "outdoor") {
        dispatch(fetchWeather(location));
      }
      setTask("");
      onClose();
    }
  };

  return (
    <form onSubmit={handleAddTask} className="flex flex-col space-y-2 mb-4 p-4 bg-white dark:bg-[#242424] rounded-lg shadow">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
        className="border p-2"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value as "indoor" | "outdoor")} className="border p-2">
        <option value="indoor">Indoor</option>
        <option value="outdoor">Outdoor</option>
      </select>
      {category === "outdoor" && (
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border p-2"
        />
      )}
      <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className="border p-2">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="datetime-local"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
        className="border p-2"
      />
      <div className="flex space-x-2">
        <Button type="submit" className="bg-[#3f9142] hover:bg-[#357937] text-white">
          Add Task
        </Button>
        <Button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;