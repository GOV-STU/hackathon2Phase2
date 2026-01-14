"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Calendar, Flag, Trash2, Edit2 } from "lucide-react";
import { Task, UpdateTaskDto } from "@/types/task";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { TaskForm } from "@/components/tasks/TaskForm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await api.getTaskById(taskId);
      if (!data) {
        toast.error("Task not found");
        router.push("/dashboard");
        return;
      }
      setTask(data);
    } catch (error) {
      toast.error("Failed to load task");
      console.error(error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      const updatedTask = await api.toggleTaskComplete(task.id);
      setTask(updatedTask);
      toast.success(
        updatedTask.completed ? "Task completed!" : "Task reopened"
      );
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleUpdateTask = async (data: UpdateTaskDto) => {
    if (!task) return;

    try {
      const updatedTask = await api.updateTask(task.id, data);
      setTask(updatedTask);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task");
      throw error;
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await api.deleteTask(task.id);
      toast.success("Task deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 mb-8 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg px-2 py-1 -ml-2"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back to tasks</span>
      </button>

      {/* Task Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={task.completed}
                onChange={handleToggleComplete}
              />
              <h1
                className={cn(
                  "text-2xl font-bold text-gray-900 dark:text-gray-50",
                  task.completed &&
                    "line-through text-gray-500 dark:text-gray-400"
                )}
              >
                {task.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditFormOpen(true)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={task.priority} size="md">
              <Flag className="h-3.5 w-3.5 mr-1.5" />
              {task.priority} priority
            </Badge>

            {task.dueDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Due {formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Task Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <span
                className={cn(
                  "font-medium",
                  task.completed
                    ? "text-green-600 dark:text-green-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Created</span>
              <span className="text-gray-900 dark:text-gray-50">
                {formatDateTime(task.createdAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Last updated
              </span>
              <span className="text-gray-900 dark:text-gray-50">
                {formatDateTime(task.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <TaskForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleUpdateTask}
        mode="edit"
        task={task}
      />
    </div>
  );
}
