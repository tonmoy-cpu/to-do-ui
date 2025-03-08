// app/page.tsx
"use client"; // Ensure this is a client component

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Home,
  Inbox,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "@/redux/actions";

export default function TaskManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const weather = useSelector((state) => state.weather);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-[#fbfdfc] dark:bg-[#1e1e1e] text-[#1b281b] dark:text-white">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-[#eef6ef] dark:border-[#2c2c2c] bg-[#fbfdfc] dark:bg-[#232323] transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        )}
      >
        {/* User profile */}
        <div className="flex items-center p-4 border-b border-[#eef6ef] dark:border-[#2c2c2c]">
          {sidebarOpen ? (
            <>
              <Avatar className="h-10 w-10 border border-[#eef6ef] dark:border-[#2c2c2c]">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User  " />
                <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-[#4f4f4f] dark:text-[#bdbdbd]">Front End Developer</p>
              </div>
            </>
          ) : (
            <Avatar className="h-10 w-10 mx-auto border border-[#eef6ef] dark:border-[#2c2c2c]">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User  " />
              <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">
                JD
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {[
              { id: "home", icon: <Home size={18} />, label: "Home" },
              { id: "inbox", icon: <Inbox size={18} />, label: "Inbox" },
              { id: "today", icon: <CheckCircle2 size={18} />, label: "Today" },
              { id: "upcoming", icon: <Clock size={18} />, label: "Upcoming" },
              { id: "important", icon: <Star size={18} />, label: "Important" },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 rounded-md text-sm",
                    activeTab === item.id
                      ? "bg-[#eef6ef] dark:bg-[#2f3630] text-[#3f9142] dark:text-[#98e19b]"
                      : "hover:bg-[#f6fff6] dark:hover:bg-[#2c2c2c]"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 px-4">
            <div
              className={cn(
                "text-xs font-medium text-[#4f4f4f] dark:text-[#bdbdbd] mb-2",
                !sidebarOpen && "text-center"
              )}
            >
              {sidebarOpen ? "YOUR TASKS" : "TASKS"}
            </div>
          </div>
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-[#eef6ef] dark:border-[#2c2c2c]">
          <button
            className={cn(
              "flex items-center text-sm text-[#4f4f4f] dark:text-[#bdbdbd] hover:text-[#1b281b] dark:hover:text-white",
              !sidebarOpen && "justify-center"
            )}
          >
            <Settings size={18} />
            {sidebarOpen && <span className="ml-3">Settings</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-[#eef6ef] dark:border-[#2c2c2c]">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-[#4f4f4f] dark:text-[#bdbdbd] hover:bg-[#eef6ef] dark:hover:bg-[#2c2c2c]"
            >
              <Menu size={20} />
            </button>
            <h1 className="ml-4 text-xl font-medium">Inbox</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f4f4f] dark:text-[#bdbdbd]"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 rounded-md bg-[#f5f5f5] dark:bg-[#2c2c2c] border border-[#eef6ef] dark:border-[#2c2c2c] focus:outline-none focus:ring-1 focus:ring-[#3f9142] dark:focus:ring-[#98e19b]"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-[#4f4f4f] dark:text-[#bdbdbd] hover:bg-[#eef6ef] dark:hover:bg-[#2c2c2c]"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button className="p-2 rounded-md text-[#4f4f4f] dark:text-[#bdbdbd] hover:bg-[#eef6ef] dark:hover:bg-[#2c2c2c]">
              <User  size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#fbfdfc] dark:bg-[#1e1e1e]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Today's Tasks</h2>
            <Button className="bg-[#3f9142] hover:bg-[#357937] dark:bg-[#3d8d40] dark:hover:bg-[#2d6930] text-white">
              <Plus size={16} className="mr-2" /> Add New
            </Button>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="mb-4 p-4 bg-white dark:bg-[#242424] rounded-lg shadow">
              <h3 className="text-lg font-medium">Current Weather</h3>
              <p>{weather.name}: {weather.main.temp}°C</p>
              <p>{weather.weather[0].description}</p>
            </div>
          )}

          {/* Task Input and List */}
          <TaskInput />
          <TaskList />
        </main>
      </div>
    </div>
  );
}

function DonutChart({ value, size = 120 }) {
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#bdbdbd"
          strokeWidth={strokeWidth}
          className="opacity-20 dark:opacity-10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#3f9142"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="dark:stroke-[#98e19b]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-medium">{value}%</span>
      </div>
    </div>
  );
}