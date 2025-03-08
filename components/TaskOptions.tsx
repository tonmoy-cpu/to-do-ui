"use client";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useDispatch } from "react-redux";
import { editTask } from "@/redux/actions";

const TaskOptions = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = (field, value) => {
    dispatch(editTask({ ...task, [field]: value }));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1"><MoreHorizontal size={16} /></button>
      {isOpen && (
        <div className="task-options">
          <button onClick={() => handleEdit("reminder", prompt("Set reminder (YYYY-MM-DDTHH:MM)", task.reminder || ""))} className="block w-full text-left py-1">Set Reminder</button>
          <button onClick={() => handleEdit("reminder", prompt("Set due date (YYYY-MM-DDTHH:MM)", task.reminder || ""))} className="block w-full text-left py-1">Due Date</button>
          <button onClick={() => handleEdit("priority", prompt("Set priority (high, medium, low)", task.priority))} className="block w-full text-left py-1">Set Priority</button>
          <button onClick={() => handleEdit("title", prompt("Edit task", task.title))} className="block w-full text-left py-1">Edit Task</button>
        </div>
      )}
    </div>
  );
};

export default TaskOptions;