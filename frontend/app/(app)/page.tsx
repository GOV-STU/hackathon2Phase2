"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { api } from "@/lib/api";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getAllTasks();
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      const newTask = await api.createTask(data as CreateTaskDto);
      setTasks([newTask, ...tasks]);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(id);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task reopened"
      );
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          My Tasks
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {tasks.filter((t) => !t.completed).length} pending tasks
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        <Button
          variant={filter === "all" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
          className="whitespace-nowrap"
        >
          All
        </Button>
        <Button
          variant={filter === "pending" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("pending")}
          className="whitespace-nowrap"
        >
          Pending
        </Button>
        <Button
          variant={filter === "completed" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setFilter("completed")}
          className="whitespace-nowrap"
        >
          Completed
        </Button>
      </div>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onTaskClick={handleTaskClick}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        aria-label="Add new task"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-premium hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 z-40 touch-manipulation"
      >
        <Plus className="h-6 w-6 mx-auto" />
      </button>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />
    </div>
  );
}
