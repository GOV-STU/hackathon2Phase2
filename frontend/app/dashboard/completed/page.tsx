"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/types/task";
import { api } from "@/lib/api";
import { TaskList } from "@/components/tasks/TaskList";
import { toast } from "sonner";

export default function CompletedPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getAllTasks();
      const completedTasks = data.filter((task) => task.completed);
      setTasks(completedTasks);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(id);
      if (!updatedTask.completed) {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success("Task reopened");
      }
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleTaskClick = (task: Task) => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Completed
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {tasks.length} completed {tasks.length === 1 ? "task" : "tasks"}
        </p>
      </div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onTaskClick={handleTaskClick}
      />
    </div>
  );
}
