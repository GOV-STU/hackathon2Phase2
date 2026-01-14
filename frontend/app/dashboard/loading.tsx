import { LoadingSkeleton } from "@/components/tasks/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="space-y-3">
        <LoadingSkeleton count={5} />
      </div>
    </div>
  );
}
