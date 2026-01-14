"use client";

import { motion } from "framer-motion";
import { Calendar, Flag } from "lucide-react";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onClick?: () => void;
}

export function TaskCard({ task, onToggleComplete, onClick }: TaskCardProps) {
  const priorityColors = {
    high: "border-l-red-500 dark:border-l-red-400",
    medium: "border-l-amber-500 dark:border-l-amber-400",
    low: "border-l-blue-500 dark:border-l-blue-400",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative p-4 md:p-4 rounded-lg border-l-4 transition-all duration-200 ease-premium cursor-pointer touch-manipulation",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        "shadow-sm hover:shadow-md active:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        priorityColors[task.priority],
        task.completed && "opacity-60"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Task: ${task.title}. ${task.completed ? "Completed" : "Pending"}. Priority: ${task.priority}.`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          className="touch-manipulation"
        >
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete?.(task.id)}
            aria-label={`Mark task as ${task.completed ? "incomplete" : "complete"}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-base font-medium text-gray-900 dark:text-gray-50 mb-1 break-words",
              task.completed && "line-through text-gray-500 dark:text-gray-400"
            )}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 break-words">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={task.priority} size="sm">
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>

            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
