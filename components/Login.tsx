"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/actions";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "user" && password === "pass") dispatch(login());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#fbfdfc] dark:bg-[#1e1e1e]">
      <form onSubmit={handleLogin} className="p-6 bg-white dark:bg-[#242424] rounded-lg shadow">
        <h2 className="text-xl font-medium mb-4">Login</h2>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="border p-2 mb-2 w-full" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2 w-full" />
        <button type="submit" className="bg-[#3f9142] hover:bg-[#357937] text-white p-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;