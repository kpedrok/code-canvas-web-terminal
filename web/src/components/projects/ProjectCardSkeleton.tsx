
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card p-6 flex flex-col h-full">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-6 w-32 rounded-md" />
        </div>
      </div>
      
      <Skeleton className="h-4 w-full mt-4 rounded-md" />
      <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
      
      <Skeleton className="h-4 w-24 mt-4 rounded-md" />
      
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}
