"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Home, Inbox, Menu, Plus, Search, Settings, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider here

export default function TaskManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const tasks = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    console.log("Theme changed to:", theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "settings") setSidebarOpen(false);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const textColor = theme === "dark" ? "#bdbdbd" : "#1b281b";

  return (
    <ThemeProvider> {/* Wrap the entire component with ThemeProvider */}
      <div className="flex h-screen bg-[#fbfdfc] dark:bg-[#1e1e1e] text-[#1b281b] dark:text-white">
        <div className={cn("flex flex-col border-r border-[#eef6ef] dark:border-[#2c2c2c] bg-[#fbfdfc] dark:bg-[#232323] transition-all duration-300", sidebarOpen ? "w-64" : "w-0 md:w-20")}>
          <div className="flex items-center p-4 border-b border-[#eef6ef] dark:border-[#2c2c2c]">
            {sidebarOpen ? (
              <>
                <Avatar className="h-10 w-10 border border-[#eef6ef] dark:border-[#2c2c2c]">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">JD</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">Hey, ABCD</p>
                  <p className="text-xs text-[#4f4f4f] dark:text-[#bdbdbd]">Front End Developer</p>
                </div>
              </>
            ) : (
              <Avatar className="h-10 w-10 mx-auto border border-[#eef6ef] dark:border-[#2c2c2c]">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-[#eef6ef] dark:bg-[#2c2c2c] text-[#3f9142] dark:text-[#98e19b]">JD</AvatarFallback>
              </Avatar>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {[
                { id: "home", icon: <Home size={18} />, label: "All Tasks" },
                { id: "inbox", icon: <Inbox size={18} />, label: "Today" },
                { id: "today", icon: <CheckCircle2 size={18} />, label: "Important" },
                { id: "upcoming", icon: <Clock size={18} />, label: "Planned" },
                { id: "important", icon: <Star size={18} />, label: "Assigned to me" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 rounded-md text-sm",
                      activeTab === item.id ? "bg-[#eef6ef] dark:bg-[#2f3630] text-[#3f9142] dark:text-[#98e19b]" : "hover:bg-[#f6fff6] dark:hover:bg-[#2c2c2c]"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {sidebarOpen && (
            <div className="p-4 border-t border-[#eef6ef] dark:border-[#2c2c2c]">
              <div className="w-24 h-24 mx-auto mb-2 relative">
                <svg key={theme} className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="40"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    style={{ fontWeight: "bold", color: textColor }}
                  >
                    {`${Math.round(progress)}%`}
                  </text>
                </svg>
              </div>
              <div className="text-center text-sm text-[#4f4f4f] dark:text-[#bdbdbd]">
                <p>Remaining: {remainingTasks}</p>
                <p>Completed: {completedTasks}</p>
              </div>
              <button
                onClick={() => handleTabChange("settings")}
                className={cn("flex items-center text-sm text-[#4f4f4f] dark:text-[#bdbdbd] hover:text-[#1b281b] dark:hover:text-white mt-4", !sidebarOpen && "justify-center")}
              >
                <Settings size={18} />
                {sidebarOpen && <span className="ml-3">Settings</span>}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between h-16 px-4 border-b border-[#eef6ef] dark:border-[#2c2c2c] bg-[#3f9142] text-white">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md text-white hover:bg-[#357937]">
                <Menu size={20} />
              </button>
              <h1 className="ml-4 text-xl font-medium">{activeTab === "inbox" ? "Inbox Tasks" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Tasks"}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-[#3f9142]"
                />
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-md text-white hover:bg-[#357937]">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button className="p-2 rounded-md text-white hover:bg-[#357937]">
                <User size={20} />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-[#fbfdfc] dark:bg-[#1e1e1e]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">
                {activeTab === "today" ? "Today's Tasks" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tasks`}
              </h2>
              <Button onClick={() => setShowTaskInput(true)} className="bg-[#3f9142] hover:bg-[#357937] text-white">
                <Plus size={16} className="mr-2" /> Add Task
              </Button>
            </div>

            {showTaskInput && <TaskInput onClose={() => setShowTaskInput(false)} />}
            <TaskList activeTab={activeTab} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}