import { LoadingSkeleton } from "@/components/tasks/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
      </div>

      <div className="space-y-3">
        <LoadingSkeleton count={4} />
      </div>
    </div>
  );
}
