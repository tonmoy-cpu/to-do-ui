// /types/task.ts
export interface Task {
    id: string;
    title: string;
    category: "indoor" | "outdoor";
    location: string;
    priority: "low" | "medium" | "high";
    reminder: string | null;
    completed: boolean; // New field to track completion
  }