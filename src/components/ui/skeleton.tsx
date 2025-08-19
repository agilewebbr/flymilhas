import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Skeleton presets para casos comuns
const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[80px]" />
      </div>
    </div>
  </div>
)

const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-4 w-[120px]" />
      <Skeleton className="h-4 w-[80px]" />
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-8 w-[120px]" />
        <Skeleton className="h-8 w-[80px]" />
      </div>
    ))}
  </div>
)

const SkeletonMetrics = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </div>
    ))}
  </div>
)

const SkeletonChart = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  </div>
)

// Spinner para loading inline
const Spinner = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
      className
    )}
    role="status"
  >
    <span className="sr-only">Carregando...</span>
  </div>
)

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonMetrics, 
  SkeletonChart,
  Spinner 
}