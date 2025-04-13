
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ProjectDetailSkeleton() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="bg-muted/10 border-b border-border p-4 flex items-center">
        <Skeleton className="h-9 w-9 rounded-md mr-4" /> {/* Back button */}
        <Skeleton className="h-7 w-48 rounded-md" /> {/* Project title */}
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-md" /> {/* Runtime button */}
          <Skeleton className="h-9 w-28 rounded-md" /> {/* Run file button */}
        </div>
      </div>
      
      {/* Content skeleton - simulates the Layout component which will load after data */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* File sidebar skeleton */}
        <div className="w-full md:w-64 border-r border-border">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`file-${i}`} className="h-6 w-full rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Main content area skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Editor skeleton */}
          <div className="flex-1 border-b border-border p-4">
            <Skeleton className="h-6 w-48 mb-4 rounded-md" />
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={`code-${i}`} className="h-4 w-full rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Terminal skeleton */}
          <div className="h-64 p-4">
            <Skeleton className="h-6 w-32 mb-3 rounded-md" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={`term-${i}`} className="h-4 w-11/12 rounded-md" />
              ))}
            </div>
            <Skeleton className="h-6 w-full mt-4 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
