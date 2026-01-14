"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Task, CreateTaskDto, UpdateTaskDto } from "@/types/task";
import { api } from "@/lib/api";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { toast } from "sonner";

export default function TodayPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getAllTasks();
      const today = new Date().toISOString().split("T")[0];

      console.log("Today page debug:");
      console.log("- Current date:", today);
      console.log("- All tasks:", data.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, completed: t.completed })));

      // Filter tasks that are due today (handle both date-only and datetime strings)
      const todayTasks = data.filter((task) => {
        if (!task.dueDate || task.completed) return false;

        // Extract date part from the dueDate (handles both "2026-01-14" and "2026-01-14T00:00:00")
        const taskDate = task.dueDate.split("T")[0];
        return taskDate === today;
      });

      console.log("- Filtered today tasks:", todayTasks);
      setTasks(todayTasks);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskDto | UpdateTaskDto) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      console.log("Creating task from today page:");
      console.log("- Input data:", data);
      console.log("- Today date:", today);

      // Ensure the task has today's due date
      const taskData = {
        ...(data as CreateTaskDto),
        dueDate: data.dueDate || today, // Use provided date or today
      };

      console.log("- Task data being sent:", taskData);

      const newTask = await api.createTask(taskData);

      console.log("- Created task:", newTask);

      // Check if the task is due today (handle both formats)
      const taskDate = newTask.dueDate ? newTask.dueDate.split("T")[0] : null;
      const isDueToday = taskDate === today;
      const isNotCompleted = !newTask.completed;

      console.log("- Task date part:", taskDate);
      console.log("- Is due today?", isDueToday);
      console.log("- Is not completed?", isNotCompleted);

      // Only add to today's list if it's due today and not completed
      if (isDueToday && isNotCompleted) {
        setTasks([newTask, ...tasks]);
        console.log("- Added to today tasks list");
      } else {
        console.log("- NOT added to today tasks (dueDate or completed mismatch)");
      }

      toast.success("Task created successfully!");
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Task creation error:", error);
      throw error;
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await api.toggleTaskComplete(id);
      if (updatedTask.completed) {
        setTasks(tasks.filter((task) => task.id !== id));
        toast.success("Task completed!");
      } else {
        setTasks(
          tasks.map((task) => (task.id === id ? updatedTask : task))
        );
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
          Today
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"} due today
        </p>
      </div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onToggleComplete={handleToggleComplete}
        onTaskClick={handleTaskClick}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        aria-label="Add new task for today"
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
