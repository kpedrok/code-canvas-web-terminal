import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ProjectDetailSkeleton() {
  return (
    <div className='flex h-screen flex-col'>
      {/* Header skeleton */}
      <div className='flex items-center border-b border-border bg-muted/10 p-4'>
        <Skeleton className='mr-4 h-9 w-9 rounded-md' /> {/* Back button */}
        <Skeleton className='h-7 w-48 rounded-md' /> {/* Project title */}
        <div className='ml-auto flex items-center gap-3'>
          <Skeleton className='h-9 w-24 rounded-md' /> {/* Runtime button */}
          <Skeleton className='h-9 w-28 rounded-md' /> {/* Run file button */}
        </div>
      </div>

      {/* Content skeleton - simulates the Layout component which will load after data */}
      <div className='flex flex-1 flex-col md:flex-row'>
        {/* File sidebar skeleton */}
        <div className='w-full border-r border-border md:w-64'>
          <div className='border-b border-border p-4'>
            <Skeleton className='h-8 w-full rounded-md' />
          </div>
          <div className='space-y-3 p-4'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`file-${i}`} className='h-6 w-full rounded-md' />
            ))}
          </div>
        </div>

        {/* Main content area skeleton */}
        <div className='flex flex-1 flex-col'>
          {/* Editor skeleton */}
          <div className='flex-1 border-b border-border p-4'>
            <Skeleton className='mb-4 h-6 w-48 rounded-md' />
            <div className='space-y-2'>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={`code-${i}`} className='h-4 w-full rounded-md' />
              ))}
            </div>
          </div>

          {/* Terminal skeleton */}
          <div className='h-64 p-4'>
            <Skeleton className='mb-3 h-6 w-32 rounded-md' />
            <div className='space-y-2'>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={`term-${i}`} className='h-4 w-11/12 rounded-md' />
              ))}
            </div>
            <Skeleton className='mt-4 h-6 w-full rounded-md' />
          </div>
        </div>
      </div>
    </div>
  )
}
