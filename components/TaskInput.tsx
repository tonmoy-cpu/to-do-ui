"use client"; // Ensure this is a client component

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "@/redux/actions";

const TaskInput = () => {
  const [task, setTask] = useState("");
  const dispatch = useDispatch();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (task) {
      dispatch(addTask(task));
      setTask("");
    }
  };

  return (
    <form onSubmit={handleAddTask} className="flex space-x-2 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task"
        className="border p-2 flex-1"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">Add Task</button>
    </form>
  );
};

export default TaskInput;