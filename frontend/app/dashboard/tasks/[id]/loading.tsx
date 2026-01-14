export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8"></div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
