"use client"; // Ensure this is a client component

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask } from "@/redux/actions";

const TaskList = () => {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center border-b p-2">
          <span>{task.title}</span>
          <button onClick={() => dispatch(deleteTask(task.id))} className="text-red-500">Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;