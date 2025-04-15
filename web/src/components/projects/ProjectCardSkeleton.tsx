import { Skeleton } from '@/components/ui/skeleton'

export function ProjectCardSkeleton() {
  return (
    <div className='flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-6'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center space-x-2'>
          <Skeleton className='h-5 w-5 rounded-md' />
          <Skeleton className='h-6 w-32 rounded-md' />
        </div>
      </div>

      <Skeleton className='mt-4 h-4 w-full rounded-md' />
      <Skeleton className='mt-2 h-4 w-3/4 rounded-md' />

      <Skeleton className='mt-4 h-4 w-24 rounded-md' />

      <div className='mt-4 flex justify-end'>
        <Skeleton className='h-9 w-28 rounded-md' />
      </div>
    </div>
  )
}
